#30 Day Guitar Bootcamp

A simple Node.js application using Express, Drizzle ORM, PostgreSQL, and EJS templates.

--Prereqs
Before running this project, make sure you have:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

  1.Clone the repository

git clone [<repository_url>](https://github.com/i8atoy/Guitar-bootcamp.git)

2.Install dependencies

npm install

3.Set up environment variables

Create a .env file in the root of your project:

DATABASE_URL=postgresql://user:password@localhost:5432/database_name
PORT=3000

4.Database setup
npx drizzle-kit push

5.Start server

npm run dev

6.Navigate to localhost

http://localhost:3000

7.DEPENDENCIES

express – Web framework

ejs – Template engine

dotenv – Load environment variables

drizzle-orm – Database ORM

drizzle-kit – Schema migrations

bcrypt – Password hashing

cookie-parser – Cookie handling
