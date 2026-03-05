# Octo Events

[![GitHub stars](https://img.shields.io/github/stars/marcosvcorsi/octo-events)](https://github.com/marcosvcorsi/octo-events/stargazers)

A **GitHub webhook listener and event management API** built with GraphQL, Express.js, and Prisma. It receives GitHub events via webhooks, persists them to PostgreSQL, and exposes a GraphQL API for querying events.

## 📋 About

Octo Events is an application that listens to GitHub Events via webhooks and exposes them through an API for later use. It implements a GraphQL API for flexible querying and uses Bull for queue-based event processing.

## ✨ Features

- **GitHub Webhook Integration**: Receives GitHub events via webhooks
- **GraphQL API**: Flexible and efficient data querying
- **Event Filtering**: Query events by issue number
- **Queue Processing**: Bull for async event processing
- **PostgreSQL Database**: Reliable data persistence with Prisma
- **Type Safety**: TypeScript throughout
- **Email Notifications**: Nodemailer integration
- **Request Validation**: class-validator for input validation
- **Logging**: Structured logging with Pino
- **Testing**: Comprehensive test coverage
- **Docker Support**: Containerized deployment
- **Code Quality**: ESLint, Prettier, Husky

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **API Framework**: Express.js + GraphQL (Apollo Server)
- **Database**: PostgreSQL (Prisma ORM)
- **Queue**: Bull (Redis-based job queue)
- **Email**: Nodemailer
- **Logging**: Pino
- **Validation**: class-validator
- **DI Container**: tsyringe
- **Testing**: Jest, Supertest
- **Docker**: Containerization

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/marcosvcorsi/octo-events.git
cd octo-events

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx prisma migrate dev
```

## 🚀 Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for staged files
npm run test:staged

# Run integration tests
npm run test:integration
```

## 📚 API Endpoints

### Webhook Endpoint

Receives GitHub events via webhook.

```bash
POST /webhook

Headers:
  X-GitHub-Event: issues
  X-Hub-Signature: sha1=...

Body: GitHub event payload
```

### GraphQL API

Query events via GraphQL at `http://localhost:4000/graphql`.

#### Get Events by Issue Number

```graphql
query GetEvents($issueNumber: Int!) {
  events(issueNumber: $issueNumber) {
    id
    action
    issueNumber
    createdAt
    issue {
      id
      title
      state
      url
    }
  }
}
```

Variables:
```json
{
  "issueNumber": 1000
}
```

Response:
```json
{
  "data": {
    "events": [
      {
        "id": "uuid",
        "action": "open",
        "issueNumber": 1000,
        "createdAt": "2024-01-01T00:00:00Z",
        "issue": {
          "id": "uuid",
          "title": "Example Issue",
          "state": "open",
          "url": "https://github.com/repo/issues/1000"
        }
      },
      {
        "id": "uuid",
        "action": "closed",
        "issueNumber": 1000,
        "createdAt": "2024-01-02T00:00:00Z",
        "issue": {
          "id": "uuid",
          "title": "Example Issue",
          "state": "closed",
          "url": "https://github.com/repo/issues/1000"
        }
      }
    ]
  }
}
```

#### Get All Issues

```graphql
query GetIssues {
  issues {
    id
    title
    state
    url
    events {
      id
      action
      createdAt
    }
  }
}
```

## 🔧 GitHub Integration

### Setting Up Webhooks

1. Go to your GitHub repository settings
2. Navigate to Webhooks → Add webhook
3. Set Payload URL to your server endpoint (e.g., `https://your-domain.com/webhook`)
4. Set Content type to `application/json`
5. Add a secret for security
6. Select events to receive (e.g., Issues)

### Webhook Events

The following events are supported:

- **issues**: Created, edited, deleted, transferred, pinned, unpinned, closed, reopened, assigned, unassigned, labeled, unlabeled, locked, unlocked, milestoned, demilestoned

### Testing Webhooks Locally

Use ngrok to expose your local server to the internet for testing:

```bash
# Install ngrok (https://ngrok.com/)
sudo ngrok http 4000

# This will give you a public URL like: https://abc123.ngrok.io
# Use this URL in your GitHub webhook settings
```

## 🏗️ Architecture

### Architecture Overview

```
GitHub
   │
   ↓ webhook
┌─────────────┐
│   Express   │  ← Receives webhook POST
└──────┬──────┘
       │
       ↓
┌─────────────┐
│    Bull     │  ← Queue for processing
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Worker     │  ← Process events
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Prisma    │  ← PostgreSQL
└─────────────┘
       │
       ↓
┌─────────────┐
│   GraphQL   │  ← Query API
└─────────────┘
```

### Directory Structure

```
octo-events/
├── src/
│   ├── main/
│   │   └── server.ts              # Application entry point
│   ├── presentation/
│   │   ├── graphql/
│   │   │   ├── schema.ts          # GraphQL schema
│   │   │   └── resolvers.ts       # GraphQL resolvers
│   │   ├── http/
│   │   │   └── webhook.ts         # Webhook endpoint
│   │   └── protocols/             # Presentation protocols
│   ├── application/
│   │   ├── usecases/              # Business logic
│   │   ├── services/              # Application services
│   │   └── protocols/             # Application protocols
│   ├── domain/
│   │   ├── entities/              # Domain entities
│   │   └── protocols/             # Domain protocols
│   ├── infrastructure/
│   │   ├── database/              # Prisma setup
│   │   │   └── prisma/            # Prisma schema & client
│   │   ├── queue/                 # Bull queue
│   │   ├── email/                 # Nodemailer
│   │   └── logging/               # Pino logging
│   └── shared/
│       └── errors/                # Error handling
├── test/
│   ├── unit/                      # Unit tests
│   ├── integration/               # Integration tests
│   └── helpers/                   # Test helpers
├── prisma/
│   └── schema.prisma              # Database schema
├── docker-compose.yml             # Docker setup
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/octo_events?schema=public"

# GitHub Webhook
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Redis (for Bull queue)
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
```

### Prisma Configuration

```prisma
// prisma/schema.prisma
model Issue {
  id        String   @id @default(uuid())
  number    Int      @unique
  title     String
  state     String
  url       String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  events    Event[]
}

model Event {
  id          String   @id @default(uuid())
  action      String
  issueNumber Int
  issue       Issue    @relation(fields: [issueId], references: [id])
  issueId     String
  createdAt   DateTime @default(now())
  payload     Json
}
```

## 📊 Database Schema

### Issues Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| number | Int | GitHub issue number |
| title | String | Issue title |
| state | String | Issue state (open/closed) |
| url | String | Issue URL |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Events Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| action | String | Event action (open, closed, etc.) |
| issueNumber | Int | Issue number |
| issueId | UUID | Foreign key to issues |
| createdAt | DateTime | Event timestamp |
| payload | JSON | Full event payload |

## 🐳 Docker Deployment

```bash
# Start all services (PostgreSQL, Redis, App)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 📝 Code Quality

```bash
# Build the project
npm run build

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🔐 Security

- **Webhook Secret**: Verify GitHub webhook signatures
- **Input Validation**: Validate all incoming data
- **SQL Injection Prevention**: Prisma ORM prevents SQL injection
- **Rate Limiting**: Implement rate limiting for webhook endpoint
- **HTTPS**: Use HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Implement the feature
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Marcos Vinicius Corsi**

- GitHub: [@marcosvcorsi](https://github.com/marcosvcorsi)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=marcosvcorsi/octo-events&type=Date)](https://star-history.com/#marcosvcorsi/octo-events&Date)

## 🔗 Resources

- [GitHub Webhooks Docs](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks)
- [Creating Webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks)
- [GraphQL](https://graphql.org/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Prisma](https://www.prisma.io/)
- [Bull](https://docs.bullmq.io/)
- [ngrok](https://ngrok.com/)
