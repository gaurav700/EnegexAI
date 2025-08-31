# EnergeX AI Test Workspace

This repository contains a full-stack application with a React frontend, a Lumen PHP API backend, MySQL, Redis, and a Node.js cache service. All services are orchestrated using Docker Compose.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Running the Application

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd energeX-ai-test
   ```

2. **Start all services:**
   ```sh
   docker-compose up --build
   ```

   This will start:
   - **Lumen API** on port `8000`
   - **React Frontend** on port `3000`
   - **Node.js Cache** on port `5000`
   - **MySQL** on port `3306`
   - **Redis** on port `6379`

3. **Access the application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:8000](http://localhost:8000)

## Running Tests

- **Lumen API:**  
  Inside the `lumen-api/lumen-app` container:
  ```sh
  docker-compose exec lumen-app vendor/bin/phpunit
  ```

- **Node.js Cache:**  
  Inside the `node-cache` container:
  ```sh
  docker-compose exec node-cache npm test
  ```

## Environment Variables

- Frontend: See `frontend/energexAI-Frontend/.env.docker`
- Backend: See `lumen-api/lumen-app/.env`
- Node Cache: See `node-cache/.env`

## Database Initialization

- MySQL is initialized using the script in `mysql-init/init.sql`.

## Stopping the Application

```sh
docker-compose down
```

---
