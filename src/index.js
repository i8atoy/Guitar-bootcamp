require("dotenv/config")
const {drizzle} = require("drizzle-orm/node-postgres")
const express = require("express");
const app = express();
const fs = require("node:fs");
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(process.env.DATABASE_URL);


app.use("/home", (req, res) => {
    res.send("home");
})

app.use("/", (req, res) => {
    const file = fs.readFileSync("./public/index.html")
    res.send(file.toString());
});

app.listen(3000, () => {
    console.log("server running");
})

