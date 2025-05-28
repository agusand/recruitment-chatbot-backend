# 🧠 HR-Intelligent Platform – Backend

Modular backend built with NestJS and TypeScript for the HR-Intelligent platform. Provides an API for candidate analysis and scoring using OpenAI.

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

Create a `.env` file in the root with the following:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hr_intelligent
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
