import { pgTable, text, timestamp, uuid, jsonb, integer, boolean, index } from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull().default("student"), // "student" | "teacher"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    token: text("token").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)]
);

// ---------------------------------------------------------------------------
// Progress persistence
// ---------------------------------------------------------------------------

// The client-side adaptive-learning state (mastery map, attempts, achievements,
// completed activities, misconception log, ...) is kept as a single JSON
// snapshot per user. The shape mirrors `AppState` in src/types/index.ts.
// This gives every student real, server-persisted progress across devices
// while preserving the existing, well-tested client-side learning engine.
export const progressSnapshots = pgTable("progress_snapshots", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  state: jsonb("state").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Exam center (structured, trusted scoring kept in application code)
// ---------------------------------------------------------------------------

export const examAttempts = pgTable(
  "exam_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    guestId: text("guest_id"), // used when no account is configured (demo/guest mode)
    examMode: text("exam_mode").notNull(), // practice | diagnostic | standard | review | speed
    config: jsonb("config").notNull(),
    results: jsonb("results").notNull(),
    scorePercent: integer("score_percent").notNull(),
    correctCount: integer("correct_count").notNull(),
    incorrectCount: integer("incorrect_count").notNull(),
    unansweredCount: integer("unanswered_count").notNull(),
    timedOutCount: integer("timed_out_count").notNull().default(0),
    totalQuestions: integer("total_questions").notNull(),
    durationSeconds: integer("duration_seconds").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("exam_attempts_user_id_idx").on(table.userId)]
);

// ---------------------------------------------------------------------------
// AI tutor conversation history (optional, per-user)
// ---------------------------------------------------------------------------

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    guestId: text("guest_id"),
    conversationId: text("conversation_id").notNull(),
    role: text("role").notNull(), // "user" | "assistant"
    content: text("content").notNull(),
    responseMode: text("response_mode"), // live_ai | rule_based | error
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("chat_messages_conversation_idx").on(table.conversationId)]
);

export const isPersistenceReady = true;
