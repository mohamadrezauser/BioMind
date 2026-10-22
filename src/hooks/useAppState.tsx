"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AppState,
  AttemptRecord,
  GameResult,
  PreOrPostTestResult,
  QuizQuestion,
} from "@/types";
import { createInitialMastery, applyEvidence } from "@/learning/mastery";
import { safeLoad, safeSave, safeReset, isStorageAvailable } from "@/services/storage";
import { useAuth } from "@/hooks/useAuth";
import { getAutoUnlocks } from "@/learning/achievements";

function randomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function createGuestState(): AppState {
  return {
    profile: {
      id: randomId(),
      displayName: "دانش‌آموز مهمان",
      createdAt: new Date().toISOString(),
    },
    onboardingComplete: false,
    mastery: createInitialMastery(),
    attempts: [],
    gameResults: [],
    achievements: [],
    completedActivities: [],
    seenQuestionIds: [],
    misconceptionLog: {},
  };
}

interface AppStateContextValue {
  state: AppState;
  storageOk: boolean;
  cloudSynced: boolean;
  recordAttempt: (args: {
    question: QuizQuestion;
    correct: boolean;
    usedHint: boolean;
    changedAnswer: boolean;
    mode: AttemptRecord["mode"];
    misconceptionId?: string;
    misconceptionResolved?: boolean;
  }) => void;
  completeActivity: (id: string) => void;
  addGameResult: (result: GameResult) => void;
  setAssessmentResult: (result: PreOrPostTestResult) => void;
  completeOnboarding: () => void;
  resetAll: () => void;
  unlockAchievement: (id: string, title: string, description: string) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => createGuestState());
  const [storageOk, setStorageOk] = useState(true);
  const [cloudSynced, setCloudSynced] = useState(false);
  const hydrated = useRef(false);
  const { user, status: authStatus } = useAuth();
  const syncedUserId = useRef<string | null>(null);
  const skipNextPush = useRef(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setStorageOk(isStorageAvailable());
    const loaded = safeLoad<AppState | null>(null);
    if (loaded && loaded.profile) {
      setState({ ...createGuestState(), ...loaded, misconceptionLog: loaded.misconceptionLog ?? {} });
    }
    hydrated.current = true;
  }, []);

  // Pull saved progress from the server once a student is authenticated.
  // This gives real, cross-device persistence on top of the local-first
  // engine. Guests keep working entirely from localStorage.
  useEffect(() => {
    if (authStatus !== "authenticated" || !user) return;
    if (syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;

    (async () => {
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        const data = await res.json();
        if (data?.state) {
          skipNextPush.current = true;
          setState((prev) => ({
            ...createGuestState(),
            ...data.state,
            profile: { ...data.state.profile, displayName: user.displayName },
            misconceptionLog: data.state.misconceptionLog ?? {},
          }));
        } else {
          // First login: seed server with whatever local/guest progress exists.
          setState((prev) => ({ ...prev, profile: { ...prev.profile, displayName: user.displayName } }));
        }
        setCloudSynced(true);
      } catch {
        // offline or server unavailable: keep working from local state only.
      }
    })();
  }, [authStatus, user]);

  // Push progress to the server whenever it changes, for authenticated users.
  useEffect(() => {
    if (!hydrated.current) return;
    if (authStatus !== "authenticated" || !user) return;
    if (skipNextPush.current) {
      skipNextPush.current = false;
      return;
    }
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      }).catch(() => undefined);
    }, 1200);
    return () => {
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, authStatus, user]);

  useEffect(() => {
    if (!hydrated.current) return;
    safeSave(state);
  }, [state]);

  // Centrally evaluate "automatic" achievements (ones not tied to a single
  // game screen) against the real, already-recorded state. This runs after
  // any learning action and only ever adds achievements the student has
  // genuinely earned; unlockAchievement() de-duplicates by id so this is safe
  // to re-run on every relevant state change without loops or duplicates.
  useEffect(() => {
    if (!hydrated.current) return;
    const unlocks = getAutoUnlocks(state);
    if (unlocks.length === 0) return;
    setState((prev) => {
      let changed = false;
      const existingIds = new Set(prev.achievements.map((a) => a.id));
      const additions = unlocks.filter((u) => !existingIds.has(u.id));
      if (additions.length === 0) return prev;
      changed = true;
      return changed
        ? {
            ...prev,
            achievements: [
              ...prev.achievements,
              ...additions.map((a) => ({ ...a, unlockedAt: new Date().toISOString() })),
            ],
          }
        : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.attempts, state.completedActivities, state.gameResults, state.mastery, state.misconceptionLog]);

  const recordAttempt = useCallback<AppStateContextValue["recordAttempt"]>((args) => {
    setState((prev) => {
      const attempt: AttemptRecord = {
        questionId: args.question.id,
        conceptId: args.question.conceptId,
        correct: args.correct,
        usedHint: args.usedHint,
        changedAnswer: args.changedAnswer,
        timestamp: new Date().toISOString(),
        mode: args.mode,
      };

      const prevMastery = prev.mastery[args.question.conceptId] ?? {
        conceptId: args.question.conceptId,
        score: 0,
        evidenceCount: 0,
        confidence: 0,
        lastUpdated: new Date().toISOString(),
        history: [],
      };

      const nextMastery = applyEvidence(prevMastery, {
        correct: args.correct,
        difficulty: args.question.difficulty,
        usedHint: args.usedHint,
        reason: args.correct ? "پاسخ صحیح" : "پاسخ نادرست",
      });

      const misconceptionLog = { ...prev.misconceptionLog };
      if (args.misconceptionId) {
        const existing = misconceptionLog[args.misconceptionId] ?? {
          detectedCount: 0,
          resolvedCount: 0,
          lastSeenAt: new Date().toISOString(),
        };
        misconceptionLog[args.misconceptionId] = {
          detectedCount: existing.detectedCount + 1,
          resolvedCount: existing.resolvedCount,
          lastSeenAt: new Date().toISOString(),
        };
      }
      return {
        ...prev,
        attempts: [...prev.attempts, attempt],
        mastery: { ...prev.mastery, [args.question.conceptId]: nextMastery },
        seenQuestionIds: Array.from(new Set([...prev.seenQuestionIds, args.question.id])),
        misconceptionLog,
        lastActivityAt: new Date().toISOString(),
      };
    });
  }, []);

  const resolveMisconception = useCallback((misconceptionId: string) => {
    setState((prev) => {
      const existing = prev.misconceptionLog[misconceptionId];
      if (!existing) return prev;
      return {
        ...prev,
        misconceptionLog: {
          ...prev.misconceptionLog,
          [misconceptionId]: { ...existing, resolvedCount: existing.resolvedCount + 1 },
        },
      };
    });
  }, []);

  // expose resolveMisconception via recordAttempt's misconceptionResolved flag
  const recordAttemptWithResolve = useCallback<AppStateContextValue["recordAttempt"]>(
    (args) => {
      recordAttempt(args);
      if (args.misconceptionResolved && args.misconceptionId) {
        resolveMisconception(args.misconceptionId);
      }
    },
    [recordAttempt, resolveMisconception]
  );

  const completeActivity = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      completedActivities: Array.from(new Set([...prev.completedActivities, id])),
      lastActivityAt: new Date().toISOString(),
    }));
  }, []);

  const addGameResult = useCallback((result: GameResult) => {
    setState((prev) => ({ ...prev, gameResults: [...prev.gameResults, result] }));
  }, []);

  const setAssessmentResult = useCallback((result: PreOrPostTestResult) => {
    setState((prev) =>
      result.kind === "pretest" ? { ...prev, pretest: result } : { ...prev, posttest: result }
    );
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((prev) => ({ ...prev, onboardingComplete: true }));
  }, []);

  const resetAll = useCallback(() => {
    safeReset();
    setState(createGuestState());
  }, []);

  const unlockAchievement = useCallback((id: string, title: string, description: string) => {
    setState((prev) => {
      if (prev.achievements.some((a) => a.id === id)) return prev;
      return {
        ...prev,
        achievements: [
          ...prev.achievements,
          { id, title, description, unlockedAt: new Date().toISOString() },
        ],
      };
    });
  }, []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      storageOk,
      cloudSynced,
      recordAttempt: recordAttemptWithResolve,
      completeActivity,
      addGameResult,
      setAssessmentResult,
      completeOnboarding,
      resetAll,
      unlockAchievement,
    }),
    [
      state,
      storageOk,
      cloudSynced,
      recordAttemptWithResolve,
      completeActivity,
      addGameResult,
      setAssessmentResult,
      completeOnboarding,
      resetAll,
      unlockAchievement,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
