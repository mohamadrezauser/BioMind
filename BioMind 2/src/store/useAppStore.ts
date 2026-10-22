import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ALL_ORGAN_IDS, TRACT_ORDER, type OrganId } from "../three/organLayout";

export type Page = "dashboard" | "lab" | "lessons" | "progress" | "about";
export type LabTab = "info" | "list" | "controls" | "tour" | "journey" | "quiz";
export type CameraPresetType = "front" | "back" | "left" | "right" | "top" | "reset" | "focus";

export interface CameraCommand {
  type: CameraPresetType;
  organId?: OrganId;
  nonce: number;
}

export interface TourState {
  active: boolean;
  index: number;
  playing: boolean;
}

export interface JourneyState {
  active: boolean;
  stageIndex: number;
  localT: number;
  playing: boolean;
  speed: number;
}

export interface ChatMessage {
  role: "user" | "tutor";
  text: string;
  organRef?: OrganId;
}

interface ProgressState {
  visitedOrgans: OrganId[];
  quizAnswers: Partial<Record<OrganId, boolean>>;
  tourCompleted: boolean;
  journeyCompleted: boolean;
}

interface AppState {
  page: Page;
  setPage: (p: Page) => void;

  labTab: LabTab;
  setLabTab: (t: LabTab) => void;

  focusMode: boolean;
  setFocusMode: (v: boolean) => void;

  selectedOrganId: OrganId | null;
  hoveredOrganId: OrganId | null;
  selectOrgan: (id: OrganId | null, opts?: { focus?: boolean }) => void;
  setHoveredOrgan: (id: OrganId | null) => void;

  visibility: Record<OrganId, boolean>;
  toggleVisibility: (id: OrganId) => void;
  showAllOrgans: () => void;

  showLabels: boolean;
  toggleLabels: () => void;
  showBody: boolean;
  toggleBody: () => void;
  transparencyMode: boolean;
  toggleTransparency: () => void;
  isolateMode: boolean;
  toggleIsolate: () => void;
  explodeOn: boolean;
  toggleExplode: () => void;

  resetScene: () => void;

  cameraCommand: CameraCommand | null;
  requestCamera: (type: CameraPresetType, organId?: OrganId) => void;

  tour: TourState;
  startTour: () => void;
  stopTour: () => void;
  tourNext: () => void;
  tourPrev: () => void;
  tourTogglePlay: () => void;

  journey: JourneyState;
  startJourney: () => void;
  stopJourney: () => void;
  journeyTogglePlay: () => void;
  journeyRestart: () => void;
  journeyNextStage: () => void;
  journeyPrevStage: () => void;
  journeySetSpeed: (s: number) => void;
  journeyTick: (deltaT: number) => void;

  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  messages: ChatMessage[];
  addMessage: (m: ChatMessage) => void;

  progress: ProgressState;
  recordQuizAnswer: (id: OrganId, correct: boolean) => void;
  markTourCompleted: () => void;
  markJourneyCompleted: () => void;
}

const defaultVisibility = Object.fromEntries(ALL_ORGAN_IDS.map((id) => [id, true])) as Record<OrganId, boolean>;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      page: "dashboard",
      setPage: (p) => set({ page: p }),

      labTab: "info",
      setLabTab: (t) => set({ labTab: t }),

      focusMode: false,
      setFocusMode: (v) => set({ focusMode: v }),

      selectedOrganId: null,
      hoveredOrganId: null,
      selectOrgan: (id, opts) => {
        set((s) => {
          const visited = id && !s.progress.visitedOrgans.includes(id)
            ? [...s.progress.visitedOrgans, id]
            : s.progress.visitedOrgans;
          return {
            selectedOrganId: id,
            labTab: id ? "info" : s.labTab,
            progress: { ...s.progress, visitedOrgans: visited },
          };
        });
        if (id && opts?.focus) get().requestCamera("focus", id);
      },
      setHoveredOrgan: (id) => set({ hoveredOrganId: id }),

      visibility: defaultVisibility,
      toggleVisibility: (id) =>
        set((s) => ({ visibility: { ...s.visibility, [id]: !s.visibility[id] } })),
      showAllOrgans: () => set({ visibility: { ...defaultVisibility } }),

      showLabels: true,
      toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
      showBody: true,
      toggleBody: () => set((s) => ({ showBody: !s.showBody })),
      transparencyMode: false,
      toggleTransparency: () => set((s) => ({ transparencyMode: !s.transparencyMode })),
      isolateMode: false,
      toggleIsolate: () => set((s) => ({ isolateMode: !s.isolateMode })),
      explodeOn: false,
      toggleExplode: () => set((s) => ({ explodeOn: !s.explodeOn })),

      resetScene: () =>
        set({
          visibility: { ...defaultVisibility },
          showLabels: true,
          showBody: true,
          transparencyMode: false,
          isolateMode: false,
          explodeOn: false,
          selectedOrganId: null,
        }),

      cameraCommand: null,
      requestCamera: (type, organId) =>
        set((s) => ({ cameraCommand: { type, organId, nonce: (s.cameraCommand?.nonce ?? 0) + 1 } })),

      tour: { active: false, index: 0, playing: false },
      startTour: () => {
        set({ tour: { active: true, index: 0, playing: true }, labTab: "tour", isolateMode: false });
        const id = TRACT_ORDER[0];
        get().selectOrgan(id, { focus: true });
      },
      stopTour: () => set({ tour: { active: false, index: 0, playing: false } }),
      tourNext: () =>
        set((s) => {
          const nextIndex = Math.min(s.tour.index + 1, TRACT_ORDER.length - 1);
          const done = s.tour.index === TRACT_ORDER.length - 1;
          if (done) {
            return { tour: { ...s.tour, playing: false } };
          }
          const id = TRACT_ORDER[nextIndex];
          setTimeout(() => get().selectOrgan(id, { focus: true }), 0);
          return { tour: { ...s.tour, index: nextIndex } };
        }),
      tourPrev: () =>
        set((s) => {
          const prevIndex = Math.max(s.tour.index - 1, 0);
          const id = TRACT_ORDER[prevIndex];
          setTimeout(() => get().selectOrgan(id, { focus: true }), 0);
          return { tour: { ...s.tour, index: prevIndex } };
        }),
      tourTogglePlay: () => set((s) => ({ tour: { ...s.tour, playing: !s.tour.playing } })),

      journey: { active: false, stageIndex: 0, localT: 0, playing: false, speed: 1 },
      startJourney: () => {
        set({
          journey: { active: true, stageIndex: 0, localT: 0, playing: true, speed: 1 },
          labTab: "journey",
          isolateMode: false,
          selectedOrganId: TRACT_ORDER[0],
        });
      },
      stopJourney: () => set({ journey: { active: false, stageIndex: 0, localT: 0, playing: false, speed: 1 } }),
      journeyTogglePlay: () => set((s) => ({ journey: { ...s.journey, playing: !s.journey.playing } })),
      journeyRestart: () =>
        set((s) => ({
          journey: { ...s.journey, stageIndex: 0, localT: 0, playing: true },
          selectedOrganId: TRACT_ORDER[0],
        })),
      journeyNextStage: () =>
        set((s) => {
          const nextIndex = Math.min(s.journey.stageIndex + 1, TRACT_ORDER.length - 1);
          return {
            journey: { ...s.journey, stageIndex: nextIndex, localT: 0 },
            selectedOrganId: TRACT_ORDER[nextIndex],
          };
        }),
      journeyPrevStage: () =>
        set((s) => {
          const prevIndex = Math.max(s.journey.stageIndex - 1, 0);
          return {
            journey: { ...s.journey, stageIndex: prevIndex, localT: 0 },
            selectedOrganId: TRACT_ORDER[prevIndex],
          };
        }),
      journeySetSpeed: (sp) => set((s) => ({ journey: { ...s.journey, speed: sp } })),
      journeyTick: (deltaT) => {
        const s = get();
        if (!s.journey.active || !s.journey.playing) return;
        let localT = s.journey.localT + deltaT * s.journey.speed;
        let stageIndex = s.journey.stageIndex;
        if (localT >= 1) {
          if (stageIndex >= TRACT_ORDER.length - 1) {
            set({ journey: { ...s.journey, localT: 1, playing: false } });
            get().markJourneyCompleted();
            return;
          }
          stageIndex += 1;
          localT = 0;
          set({ selectedOrganId: TRACT_ORDER[stageIndex] });
        }
        set({ journey: { ...s.journey, stageIndex, localT } });
      },

      chatOpen: false,
      setChatOpen: (v) => set({ chatOpen: v }),
      messages: [
        {
          role: "tutor",
          text: "سلام! من دستیار آموزشی بیومایند هستم. درباره هر اندام دستگاه گوارش بپرس تا هم توضیح بدهم و هم در مدل سه‌بعدی نشانت بدهم.",
        },
      ],
      addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),

      progress: { visitedOrgans: [], quizAnswers: {}, tourCompleted: false, journeyCompleted: false },
      recordQuizAnswer: (id, correct) =>
        set((s) => ({ progress: { ...s.progress, quizAnswers: { ...s.progress.quizAnswers, [id]: correct } } })),
      markTourCompleted: () => set((s) => ({ progress: { ...s.progress, tourCompleted: true } })),
      markJourneyCompleted: () => set((s) => ({ progress: { ...s.progress, journeyCompleted: true } })),
    }),
    {
      name: "biomind-progress",
      partialize: (s) => ({ progress: s.progress }),
    }
  )
);
