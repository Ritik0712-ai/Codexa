# Codexa - AI Code Review Assistant

A modern full-stack web application that helps developers improve their code quality using AI-powered reviews and static code analysis.

## Features

- 🔐 **Authentication** - Secure login/signup with email and password
- ✨ **AI Code Reviews** - Get instant feedback powered by GPT-4
- 📊 **Static Analysis** - Automatic detection of code issues
- 📈 **Complexity Metrics** - Cyclomatic complexity, LOC, and more
- 💾 **Review History** - Save and search past reviews
- 🎨 **Modern UI** - Dark theme with Tailwind CSS

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Monaco Editor
- TanStack Query
- Lucide Icons

**Backend:**
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)

**AI:**
- OpenAI GPT-4

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase)
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ritik0712-ai/Codexa.git
cd Codexa
```

2. Set up the backend
```bash
cd backend
cp .env.example .env
# Edit .env with your database URL and OpenAI key
npm install
npx prisma generate
npx prisma db push
npm run dev
```

3. Set up the frontend
```bash
cd frontend
npm install
npm run dev
```

4. Open http://localhost:3000

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out

### Reviews
- `POST /api/reviews/snippet` - Create review from code
- `POST /api/reviews/upload` - Create review from file
- `GET /api/reviews` - List all reviews
- `GET /api/reviews/:id` - Get review details
- `DELETE /api/reviews/:id` - Delete review

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users/stats` - Get user statistics

## Deployment

**Frontend:** Deploy to Vercel
```bash
cd frontend
vercel
```

**Backend:** Deploy to Render or Railway
```bash
cd backend
# Connect to your preferred platform
```

## License

MIT
