// Shared TypeScript types for BioMind
// Keep developer-facing identifiers in English; all student-facing text lives in content files (Persian).

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type MasteryLevel = "unknown" | "weak" | "developing" | "proficient" | "mastered";

export interface ConceptMastery {
  conceptId: string;
  /** 0-100 estimated mastery score */
  score: number;
  /** number of evidence points collected (answers, hints, activities) */
  evidenceCount: number;
  /** confidence in current diagnosis, 0-1 */
  confidence: number;
  lastUpdated: string; // ISO date
  history: Array<{ delta: number; reason: string; at: string }>;
}

export interface ConceptDefinition {
  id: string;
  title: string; // Persian title
  shortTitle?: string;
  explanation: string; // verified Persian explanation
  analogy?: string; // everyday-life analogy in Persian
  prerequisites: string[]; // concept ids
  relatedOrgans: string[]; // organ ids
  relatedProcesses: string[];
  commonMisconceptionIds: string[];
  sourceNote: string; // verification / source note
}

export type TeachingStrategyCode =
  | "simple_explanation"
  | "analogy"
  | "step_by_step"
  | "visual_diagram"
  | "guided_simulation"
  | "mini_game"
  | "prerequisite_question"
  | "worked_example"
  | "comparison_table"
  | "misconception_correction"
  | "review_then_question";

export interface TeachingStrategy {
  code: TeachingStrategyCode;
  label: string; // Persian label
  description: string; // Persian rationale template
}

export interface MisconceptionDefinition {
  id: string;
  conceptId: string;
  title: string; // Persian name of misconception
  belief: string; // the incorrect belief, in Persian
  evidenceHints: string[]; // Persian clues that may indicate it
  diagnosticQuestionId: string; // quiz bank question id used to confirm
  targetedExplanation: string; // Persian corrective explanation
  followUpQuestionId: string; // quiz bank question id to verify improvement
}

export type QuestionType =
  | "mcq"
  | "true_false"
  | "matching"
  | "ordering"
  | "labeling"
  | "short_answer"
  | "scenario";

export interface MatchingPair {
  left: string;
  right: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  conceptId: string;
  difficulty: DifficultyLevel;
  skillType: "recall" | "conceptual";
  prompt: string; // Persian question text
  // mcq / true_false / scenario
  options?: string[];
  correctIndex?: number;
  // matching
  pairs?: MatchingPair[];
  // ordering
  items?: string[];
  correctOrder?: number[];
  // labeling
  labelTargets?: string[]; // organ ids in correct visual order
  // short answer
  acceptableAnswers?: string[];
  hint: string;
  explanationCorrect: string;
  explanationIncorrect: string;
  /** maps a wrong option index to a likely misconception id, for evidence-based diagnosis */
  misconceptionByOption?: Record<number, string>;
}

export interface OrganDefinition {
  id: string;
  name: string; // Persian name
  scientificName?: string; // Latin/English in parentheses usage
  summary: string;
  processes: Array<"mechanical" | "chemical" | "absorption" | "elimination" | "transport">;
  secretions: string[];
  enzymes: string[];
  incoming: string[];
  outgoing: string[];
  order: number;
}

export interface FoodJourneyStage {
  organId: string;
  title: string;
  mechanical?: string;
  chemical?: string;
  absorption?: string;
  composition: string; // description of food composition change
  agents: string[]; // enzymes / substances involved
  checkQuestionId?: string;
}

export interface FoodJourney {
  id: string;
  name: string; // Persian food name
  macronutrient: "carbohydrate" | "protein" | "lipid" | "mixed";
  description: string;
  stages: FoodJourneyStage[];
}

export interface NutrientAbsorptionCase {
  id: string;
  nutrient: string;
  source: string;
  route: "blood_capillary" | "lymph";
  explanation: string;
  checkpointQuestion: string;
  checkpointOptions: string[];
  correctIndex: number;
}

export interface AttemptRecord {
  questionId: string;
  conceptId: string;
  correct: boolean;
  usedHint: boolean;
  changedAnswer: boolean;
  timestamp: string;
  mode: "quiz" | "pretest" | "posttest" | "tutor" | "game";
}

export type TutorPhase =
  | "ask_diagnostic"
  | "analyze"
  | "teach"
  | "ask_followup"
  | "evaluate"
  | "advance";

export interface TutorTurn {
  id: string;
  phase: TutorPhase;
  conceptId: string;
  speaker: "tutor" | "student";
  text: string;
  strategy?: TeachingStrategyCode;
  rationale?: string;
  questionId?: string;
}

export interface StudentProfile {
  id: string;
  displayName: string;
  createdAt: string;
  isFictionalDemo?: boolean;
}

export interface GameResult {
  gameId:
    | "pathway"
    | "enzyme_match"
    | "nutrient_destination"
    | "concept_duel"
    | "memory_match"
    | "rapid_recall"
    | "biology_detective";
  score: number;
  total: number;
  completedAt: string;
}

export interface AchievementState {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
}

export interface PreOrPostTestResult {
  kind: "pretest" | "posttest";
  byConcept: Record<string, { correct: number; total: number }>;
  overallScore: number;
  completedAt: string;
}

export interface AppState {
  profile: StudentProfile;
  onboardingComplete: boolean;
  mastery: Record<string, ConceptMastery>;
  attempts: AttemptRecord[];
  gameResults: GameResult[];
  achievements: AchievementState[];
  pretest?: PreOrPostTestResult;
  posttest?: PreOrPostTestResult;
  completedActivities: string[];
  seenQuestionIds: string[];
  lastActivityAt?: string;
  misconceptionLog: Record<string, { detectedCount: number; resolvedCount: number; lastSeenAt: string }>;
}
