# EnergeX AI Test Workspace

This repository contains a full-stack application with a React frontend, a Lumen PHP API backend, MySQL, Redis, and a Node.js cache service. All services are orchestrated using Docker Compose.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Running the Application

1. **Clone the repository:**
   ```sh
   git clone https://github.com/gaurav700/EnegexAI.git
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


## Stopping the Application

```sh
docker-compose down
```

---
