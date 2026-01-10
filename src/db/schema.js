const { unique } = require("drizzle-orm/gel-core");
const { integer, pgTable, text, uuid } = require("drizzle-orm/pg-core");

const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  age: integer().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
});

const sessionTable = pgTable("session", {
  id: uuid().primaryKey(),
  userId: integer(),
});

const userProgressTable = pgTable("userProgress", {
  id: uuid().primaryKey().defaultRandom(),
  lessonId: integer().notNull(),
  userId: integer().notNull(),
});

const lessonsTable = pgTable("lessons", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull().unique(),
  description: text().notNull(),
  video_url: text().notNull(),
});

const quizzezTable = pgTable("quizzes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  lessonid: integer().notNull(),
});

const quizQuestionsTable = pgTable("quiz_questions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  quiz_id: integer().notNull(),
  question_text: text().notNull(),
});

const quizAnswersTable = pgTable("quiz_answers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  quiz_id: integer().notNull(),
  question_answer: text().notNull(),
});

module.exports = {
  usersTable,
  sessionTable,
  userProgressTable,
  lessonsTable,
  quizzezTable,
  quizQuestionsTable,
  quizAnswersTable,
};
