require("dotenv/config");
const { drizzle } = require("drizzle-orm/node-postgres");
const express = require("express");
const path = require("path");
const app = express();
const fs = require("node:fs");
const { usersTable, sessionTable } = require("./db/schema");
const { eq, ConsoleLogWriter } = require("drizzle-orm");
const bcrypt = require("bcrypt");
const { redirect } = require("express/lib/response");
const { randomUUID } = require("node:crypto");
const cookieParser = require("cookie-parser");
const db = drizzle(process.env.DATABASE_URL);
const { isLoggedIn, isNotLoggedIn } = require("./middleware/auth");
const { initUserProgress } = require("./query");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

// req.userid is the user that is currently logged in. Saved in database and session id is stored as a cookie
// so you check for req.userid to see who is logged in, and then find what you need.

//middleware. acts for each handler
app.use(async (req, res, next) => {
  const sessionId = req.cookies?.sessionId;
  if (!sessionId) {
    next();
    return;
  }
  const sessionResult = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionId, sessionTable.id));

  if (!sessionResult[0]) {
    res.clearCookie("sessionId");
    next();
    return;
  }
  req.userId = sessionResult[0].userId;
  next();
});

app.get("/home", isLoggedIn, async (req, res) => {
  const result = await db
    .select({ name: usersTable.name })
    .from(usersTable)
    .where(eq(usersTable.id, req.userId));

  const user = result[0];

  res.render("home", {
    name: user.name,
  });
});

app.use("/public", express.static(path.join(__dirname, "..", "public")));

app.get("/login", isNotLoggedIn, (req, res) => {
  const file = fs.readFileSync("./pages/login.html");
  res.send(file.toString());
});

app.get("/register", isNotLoggedIn, (req, res) => {
  const file = fs.readFileSync("./pages/register.html");
  res.send(file.toString());
});

app.get("/", (req, res) => {
  const file = fs.readFileSync("./pages/index.html");
  res.send(file.toString());
});

app.post("/register", async (req, res) => {
  const name = req.body["full-name"];
  const age = parseInt(req.body.age, 10);

  if (typeof name !== "string") {
    res.status(400).send("Name must be a valid string");
    console.log("error name");
    return;
  }

  if (isNaN(age) || !Number.isInteger(age)) {
    res.status(400).send("Age must be an integer");
    console.log("error age");
    return;
  }

  const passwordHash = bcrypt.hashSync(req.body.password, 12);
  try {
    const result = await db
      .insert(usersTable)
      .values({
        name: name.trim(),
        age: age,
        email: req.body.email,
        password: passwordHash,
      })
      .returning({ id: usersTable.id });

    const user = result[0];
    const sessionId = randomUUID();
    await db.insert(sessionTable).values({ id: sessionId, userId: user.id });
    await initUserProgress(user.id);
    res.cookie("sessionId", sessionId);
  } catch (error) {
    console.error(error);
    res.redirect("/register");
    return;
  }
  res.redirect("/home");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await db
    .select({ id: usersTable.id, password: usersTable.password })
    .from(usersTable)
    .where(eq(usersTable.email, email));
  const user = result[0];
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    res.redirect("/login");
    return;
  }
  const sessionId = randomUUID();
  await db.insert(sessionTable).values({ id: sessionId, userId: user.id });
  res.cookie("sessionId", sessionId);
  res.redirect(`/home?id=${user.id}`);
});

app.listen(3000, () => {
  console.log("server running");
});
