const {
  usersTable,
  sessionTable,
  userProgressTable,
  lessonsTable,
  quizQuestionsTable,
} = require("./db/schema");
const { eq, sql, getTableColumns } = require("drizzle-orm");
require("dotenv/config");
const bcrypt = require("bcrypt");

class DbClient {
  #db;
  constructor(db) {
    this.#db = db;
  }

  async queryUserProgress(userId) {
    const result = await this.#db
      .select({ lessonId: userProgressTable.lessonId })
      .from(userProgressTable)
      .where(eq(userProgressTable.userId, userId));

    return result[0].lessonId;
  }

  async createUser(name, age, email, password) {
    const userId = await this.#db.transaction(async (tx) => {
      const passwordHash = bcrypt.hashSync(password, 12);
      const result = await tx
        .insert(usersTable)
        .values({
          name: name.trim(),
          age: age,
          email: email,
          password: passwordHash,
        })
        .returning({ id: usersTable.id });
      await tx.insert(userProgressTable).values({
        lessonId: 1,
        userId: result[0].id,
      });
      return result[0].id;
    });
    return userId;
  }

  async getUserName(userId) {
    const result = await this.#db
      .select({ name: usersTable.name })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    return result[0].name;
  }

  async getUserData(userId) {
    const result = await this.#db
      .select({ name: usersTable.name, lessonId: userProgressTable.lessonId })
      .from(usersTable)
      .leftJoin(userProgressTable, eq(usersTable.id, userProgressTable.userId))
      .where(eq(userId, usersTable.id));
    return result[0];
  }

  async incrementLessonCounter(userId) {
    const [currentProgress] = await this.#db
      .select()
      .from(userProgressTable)
      .where(eq(userProgressTable.userId, userId));

    await this.#db
      .update(userProgressTable)
      .set({
        quizComplete: false,
        lessonId: currentProgress.lessonId + 1,
      })
      .where(eq(userProgressTable.userId, userId));
  }

  async getLessonData(lessonId) {
    const result = await this.#db
      .select({
        ...getTableColumns(quizQuestionsTable),
        ...getTableColumns(lessonsTable),
      })
      .from(lessonsTable)
      .leftJoin(
        quizQuestionsTable,
        eq(lessonsTable.id, quizQuestionsTable.lessonId)
      )
      .where(eq(lessonId, lessonsTable.id));
    return result[0];
  }

  async markQuizComplete(userId, lessonId) {
    await this.#db
      .update(userProgressTable)
      .set({ quizComplete: true })
      .where(
        eq(userProgressTable.userId, userId),
        eq(userProgressTable.lessonId, lessonId)
      );
    return;
  }

  async checkQuizCompletion(userId, lessonId) {
    const quizCompleted = await this.#db
      .select({ quizComplete: userProgressTable.quizComplete })
      .from(userProgressTable)
      .where(
        eq(userId, userProgressTable.userId),
        eq(lessonId, userProgressTable.lessonId)
      );
    return quizCompleted[0].quizComplete;
  }
}

module.exports = { DbClient };
