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

// const lessonTable

module.exports = { usersTable, sessionTable, userProgressTable };
