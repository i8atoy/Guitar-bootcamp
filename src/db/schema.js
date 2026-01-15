const { sql } = require("drizzle-orm");
const {
  integer,
  pgTable,
  text,
  uuid,
  boolean,
} = require("drizzle-orm/pg-core");

const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  age: integer().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
});

const sessionTable = pgTable("session", {
  id: uuid().primaryKey(),
  userId: integer().references(() => usersTable.id),
});

const userProgressTable = pgTable("userProgress", {
  id: uuid().primaryKey().defaultRandom(),
  lessonId: integer()
    .notNull()
    .references(() => lessonsTable.id),
  userId: integer()
    .notNull()
    .references(() => usersTable.id),
  quizComplete: boolean().notNull().default(false),
});

const lessonsTable = pgTable("lessons", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  title: text().notNull().unique(),
  description: text().notNull(),
  videoUrl: text().notNull(),
});

const quizQuestionsTable = pgTable("quiz_questions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  lessonId: integer()
    .notNull()
    .references(() => lessonsTable.id),
  questionText: text().notNull(),
  questionOptions: text()
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  questionAnswerIndex: integer().notNull(),
});

module.exports = {
  usersTable,
  sessionTable,
  userProgressTable,
  lessonsTable,
  quizQuestionsTable,
};
