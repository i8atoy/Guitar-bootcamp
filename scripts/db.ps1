docker run -d --name postgres -e POSTGRES_PASSWORD=mypassword -p 6432:5432 -v postgres_data:/var/lib/postgresql/data postgres:16
