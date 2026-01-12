const {
  usersTable,
  sessionTable,
  userProgressTable,
  lessonsTable,
  quizQuestionsTable,
} = require("./db/schema");
const { eq, count, getTableColumns } = require("drizzle-orm");
require("dotenv/config");

class DbClient {
  #db;
  constructor(db) {
    this.#db = db;
  }

  async queryUserProgress(userId) {
    const result = await this.#db
      .select({ count: count() })
      .from(userProgressTable)
      .where(eq(userProgressTable.userId, userId));

    return result[0]?.count || 0;
  }

  async initUserProgress(userId) {
    await this.#db.insert(userProgressTable).values({
      lessonId: 1,
      userId: userId,
    });
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
    // await this.#db.update()
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
}

module.exports = { DbClient };
