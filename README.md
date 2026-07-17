# Codexa - AI-Powered Code Review Assistant

<div align="center">

![Codexa](https://img.shields.io/badge/Codexa-AI%20Code%20Review-4F46E5?style=for-the-badge&logo=robot&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)

*A modern full-stack SaaS application that helps developers improve code quality using AI-powered reviews and static code analysis.*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [API Reference](#-api-reference) • [Project Structure](#-project-structure) • [Contributing](#-contributing)

</div>

---

## 🎯 Features

### Core Functionality
- **🔐 Secure Authentication** - Email/password registration and login with session management
- **✨ AI-Powered Reviews** - GPT-4 powered code analysis with actionable suggestions
- **📊 Static Analysis** - Automated detection of code issues, style violations, and potential bugs
- **📈 Complexity Metrics** - Cyclomatic complexity, lines of code, function counts, and quality scores
- **💾 Review History** - Save, search, and revisit past code reviews

### User Experience
- **🎨 Modern Dark UI** - Premium developer-focused interface inspired by Linear and Vercel
- **📝 Monaco Editor** - IDE-like code editing with syntax highlighting and IntelliSense
- **⚡ Real-time Processing** - Async review processing with status tracking
- **📱 Responsive Design** - Fully responsive across desktop, tablet, and mobile

### Supported Languages
JavaScript, TypeScript, Python, Java, C++, C, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, SQL, HTML, CSS, JSON, YAML, Markdown

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Code Editor** | Monaco Editor |
| **State Management** | React Context + TanStack Query |
| **Backend** | Express.js, TypeScript |
| **Database** | PostgreSQL via Prisma ORM |
| **AI Integration** | OpenAI GPT-4 API |
| **Authentication** | JWT with refresh tokens |
| **Validation** | Zod |
| **Icons** | Lucide React |
| **Charts** | Recharts |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Supabase](https://supabase.com))
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repository
git clone https://github.com/Ritik0712-ai/Codexa.git
cd Codexa

# Set up backend
cd backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and OPENAI_API_KEY
npx prisma generate
npx prisma db push
npm run dev

# Set up frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

**Backend (`backend/.env`):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/codexa
OPENAI_API_KEY=sk-your-api-key
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 📡 API Reference

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create new account |
| `/api/auth/login` | POST | Sign in |
| `/api/auth/logout` | POST | Sign out |

### Reviews

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reviews/snippet` | POST | Create review from code snippet |
| `/api/reviews/upload` | POST | Create review from uploaded file |
| `/api/reviews` | GET | List all user reviews |
| `/api/reviews/:id` | GET | Get review details |
| `/api/reviews/:id` | DELETE | Delete a review |

### Users

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/me` | GET | Get current user profile |
| `/api/users/me` | PUT | Update profile |
| `/api/users/stats` | GET | Get user statistics |

---

## 📁 Project Structure

```
Codexa/
├── frontend/                    # Next.js 14 frontend application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Registration page
│   │   │   └── dashboard/      # Protected dashboard
│   │   │       ├── page.tsx    # Dashboard home
│   │   │       ├── history/    # Review history
│   │   │       ├── new-review/ # Create new review
│   │   │       ├── review/     # Review details
│   │   │       └── profile/   # User profile
│   │   ├── context/            # React contexts (Auth)
│   │   └── lib/               # Utilities, API client
│   ├── public/                # Static assets
│   └── package.json
│
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.ts        # Authentication routes
│   │   │   ├── reviews.ts     # Review CRUD routes
│   │   │   └── users.ts       # User management routes
│   │   └── services/          # Business logic
│   │       ├── aiReview.ts    # OpenAI integration
│   │       ├── staticAnalysis.ts # ESLint-style analysis
│   │       └── metrics.ts     # Complexity calculations
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── package.json
│
├── Documents/                  # Project documentation
│   ├── PRD.md                 # Product Requirements
│   ├── TRD.md                 # Technical Requirements
│   └── UI_UX_Design.md       # Design specifications
│
├── .gitignore
├── README.md
└── TODO.md                    # Implementation tracking
```

---

## 🗄 Database Schema

The application uses PostgreSQL with the following main entities:

- **User** - User accounts with authentication
- **Session** - Active login sessions
- **Review** - Code review records
- **ReviewFinding** - Individual issues found during review
- **ReviewMetric** - Complexity and quality metrics
- **UploadedFile** - File upload tracking
- **AuditLog** - Security and audit trail

---

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT-based authentication with refresh tokens
- Input validation with Zod
- SQL injection protection via Prisma ORM
- CORS policy enforcement
- Rate limiting ready
- Audit logging

---

## 📈 Complexity Metrics

The application calculates:

- **Lines of Code (LOC)** - Total lines analyzed
- **Functions** - Number of functions detected
- **Classes** - Number of classes detected
- **Cyclomatic Complexity** - Code path complexity
- **File Complexity** - Overall complexity score (0-100)

---

## 🌐 Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel
```

### Backend (Render/Railway)

```bash
cd backend
# Connect to Render/Railway via GitHub
# Set environment variables in dashboard
# Deploy
```

---

## 📖 Documentation

- [Product Requirements Document](./Documents/PRD.md)
- [Technical Requirements Document](./Documents/TRD.md)
- [UI/UX Design Brief](./Documents/UI_UX_Design.md)
- [2-Day Implementation Plan](./Documents/2_Day_Plan.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ritik Agarwal**

Built with ❤️ for the developer community

---

## ⭐ Show Your Support

If this project helped you, please give it a star! It helps the project grow and motivates me to keep improving it.

