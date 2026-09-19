# TalentSync

Simple microservices project for job posting and recruitment tracking.

## Services

1. Eureka Server - `8761`
2. Auth Service - `8081`
3. Job Service - `8082`
4. Application Service - `8083`
5. Recruitment Service - `8084`
6. API Gateway - `8085`

User, job, and application data is stored in PostgreSQL. The default connection is `localhost:5432`, database `talentsync`, username `postgres`, password `postgres`. You can change it with `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` environment variables.

## Run

Open one terminal in each service folder and run:

```text
mvn spring-boot:run
```

Start Eureka first, then the other services, and finally the frontend:

```text
cd frontend
npm run dev
```

Open the URL shown by Vite. The frontend calls the API Gateway on port `8085`.

## PostgreSQL setup

Install PostgreSQL, then create the database once:

```sql
CREATE DATABASE talentsync;
```

Or, if Docker is installed, run `docker compose up -d postgres` from the project root. This creates PostgreSQL with the default settings automatically.

Start PostgreSQL before starting the Auth, Job, and Application services. Spring Boot creates the tables automatically on first run.

## Main API examples

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/jobs
POST /api/jobs
GET  /api/applications
POST /api/applications
GET  /api/recruitment/pipeline
```

JWT tokens are returned by register/login. The signing key is in `auth-service/src/main/resources/application.properties` and should be changed for production.
