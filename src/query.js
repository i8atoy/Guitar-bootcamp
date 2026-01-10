const { usersTable, sessionTable, userProgressTable } = require("./db/schema");
const { eq, count } = require("drizzle-orm");
const { drizzle } = require("drizzle-orm/node-postgres");
require("dotenv/config");

const db = drizzle(process.env.DATABASE_URL);

let queryUserProgress = async function (userId) {
  const result = await db
    .select({ count: count() })
    .from(userProgressTable)
    .where(eq(userProgressTable.userId, userId));

  return result[0]?.count || 0;
};

let initUserProgress = async function (userId) {
  await db.insert(userProgressTable).values({
    lessonId: 0,
    userId: userId,
  });
};

module.exports = { queryUserProgress, initUserProgress };
