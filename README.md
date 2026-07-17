# Codexa - AI-Powered Code Review Assistant

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI">
</div>

<br>

> **Codexa** is an AI-powered code review assistant that helps developers write better, cleaner, and more secure code through instant, actionable feedback powered by GPT-4.

## ✨ Features

- 🚀 **Instant Code Analysis** - Get comprehensive reviews in seconds
- 🤖 **AI-Powered Reviews** - GPT-4 analyzes your code like a senior engineer
- 🔒 **Security Focused** - Detect vulnerabilities before they reach production
- 📊 **Static Analysis** - Syntax, style, complexity, and best practices
- 📈 **Metrics Dashboard** - Track your code quality over time
- 🌐 **Multi-Language Support** - JavaScript, TypeScript, Python, Java, C++, Go, Rust, and more

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### Backend
- **Express.js** - Fast Node.js framework
- **TypeScript** - Type-safe development
- **Prisma** - Next-generation ORM
- **OpenAI API** - GPT-4 for intelligent analysis

### Database
- **PostgreSQL** - Relational database for users and reviews

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (for production)
- OpenAI API Key (for AI features)

### Demo Mode (No Setup Required)

The app includes a **demo mode** that works without a database or OpenAI API key:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

### Production Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/Ritik0712-ai/Codexa.git
cd Codexa
```

#### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/codexa"
OPENAI_API_KEY="sk-your-api-key-here"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

#### 3. Database Setup

```bash
cd backend
npx prisma generate
npx prisma db push
```

#### 4. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

#### 5. Run the App

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
AI-code-Review/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── src/
│   │   ├── index.ts          # Express server entry
│   │   ├── routes/
│   │   │   ├── auth.ts        # Authentication routes
│   │   │   ├── reviews.ts     # Review API routes
│   │   │   └── users.ts      # User routes
│   │   └── services/
│   │       ├── aiReview.ts    # OpenAI integration
│   │       ├── metrics.ts     # Code metrics
│   │       └── staticAnalysis.ts  # Static analysis
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── login/page.tsx     # Login
│   │   │   ├── register/page.tsx  # Register
│   │   │   └── dashboard/
│   │   │       ├── page.tsx           # Dashboard
│   │   │       ├── new-review/page.tsx   # Create review
│   │   │       ├── history/page.tsx      # Review history
│   │   │       ├── profile/page.tsx      # User profile
│   │   │       └── review/[id]/page.tsx # Review details
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Auth state
│   │   └── lib/
│   │       └── api.ts            # API client
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out

### Reviews
- `POST /api/reviews/snippet` - Create snippet review
- `POST /api/reviews/file` - Upload file for review
- `GET /api/reviews` - List user's reviews
- `GET /api/reviews/:id` - Get review details
- `DELETE /api/reviews/:id` - Delete review

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/stats` - Get user statistics

## 🎨 Screenshots

| Landing Page | Dashboard | Code Review |
|-------------|-----------|-------------|
| Clean, modern landing page | Stats and recent activity | Issues with severity levels |

## 🔒 Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes (production) |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | Yes (production) |
| `PORT` | Server port | No (default: 3001) |
| `FRONTEND_URL` | Frontend URL for CORS | No (default: http://localhost:3000) |

### Frontend (.env.local)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | No (default: http://localhost:3001) |

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

- GitHub: [@Ritik0712-ai](https://github.com/Ritik0712-ai)
- Project Link: [https://github.com/Ritik0712-ai/Codexa](https://github.com/Ritik0712-ai/Codexa)

---

<div align="center">
  <strong>Built with ❤️ for developers who care about code quality</strong>
</div>
