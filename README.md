# 🧠 HR-Intelligent Platform – Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Modular backend built with NestJS and TypeScript for the HR-Intelligent platform. Provides an API for candidate analysis and scoring using OpenAI.

## ✨ Features

- Candidate analysis and scoring using OpenAI
- Modular architecture with NestJS
- PostgreSQL integration
- Dockerized for easy deployment
- Code quality enforced with ESLint, Prettier, Husky, and lint-staged

## 🚀 Tech Stack

- **NestJS**: Progressive Node.js framework
- **TypeScript**: Static typing for JavaScript
- **PostgreSQL**: Relational database
- **Docker & Docker Compose**: Containerization and orchestration
- **Yarn**: Package manager
- **Husky & lint-staged**: Git hooks for code quality
- **ESLint & Prettier**: Linting and formatting

## 🛠️ Project Setup

### Clone the repository

```bash
git clone https://github.com/agusand/HR-Intelligent-Platform.git
cd HR-Intelligent-Platform
```

### Install dependencies

```bash
yarn install
```

### Environment variables

Create a `.env` file in the root with the following (see also `.env.example`):

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-3.5-turbo

DATABASE_NAME=hr_intelligent
DATABASE_HOST=localhost
DATABASE_PASSWORD=password
DATABASE_USERNAME=user
DATABASE_PORT=3306
```

### Start with Docker Compose

```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000`.

## ✅ Available Scripts

- `yarn start`: Start the app
- `yarn start:dev`: Development mode
- `yarn build`: Compile the project
- `yarn lint`: Run ESLint
- `yarn format`: Run Prettier
- `yarn test`: Run tests with Jest

## 🧪 Testing

```bash
yarn test
```

## 📄 License

MIT

## 🚦 Next Steps

- [ ] Implement CI/CD pipelines (e.g., GitHub Actions) for automated testing, linting, and deployment.
- [ ] Expand automated test coverage (integration, e2e).
- [ ] Add and maintain API documentation (Swagger/OpenAPI).
- [ ] Enhance error handling and logging.
- [ ] Review and optimize Docker configurations for production.
