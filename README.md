# 30 Day Guitar Bootcamp

30 Day Guitar Bootcamp – A structured Node.js web app guiding users through 28 sequentially unlocked guitar lessons, complete with quizzes after each lesson and a certificate of completion at the end.

--Prereqs
Before running this project, make sure you have:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Clone the repository

```bash
git clone [<repository_url>](https://github.com/i8atoy/Guitar-bootcamp.git)
```

## Install dependencies

```bash
npm install
```

## Set up environment variables

Create a .env file in the root of your project and add this inside:

DATABASE_URL=postgresql://user:password@localhost:5432/database_name
PORT=3000

## Database setup

```bash
npx drizzle-kit push
```

## Start server

```bash
npm run dev
```

## Navigate to localhost

http://localhost:3000

## DEPENDENCIES

express – Web framework

ejs – Template engine

dotenv – Load environment variables

drizzle-orm – Database ORM

drizzle-kit – Schema migrations

bcrypt – Password hashing

cookie-parser – Cookie handling
