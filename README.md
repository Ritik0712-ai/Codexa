# Codexa - AI Code Review Assistant

A modern full-stack web application that helps developers improve their code quality using AI-powered reviews and static code analysis.

![Codexa Banner](https://via.placeholder.com/1200x400/0F172A/4F46E5?text=Codexa+AI+Code+Review)

## 🌟 Features

- 🔐 **Authentication** - Secure login/signup with email and password
- ✨ **AI Code Reviews** - Get instant feedback powered by GPT-4
- 📊 **Static Analysis** - Automatic detection of code issues
- 📈 **Complexity Metrics** - Cyclomatic complexity, LOC, and more
- 💾 **Review History** - Save and search past reviews
- 🎨 **Modern UI** - Dark theme with Tailwind CSS
- 📝 **Monaco Editor** - IDE-like code editing experience

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Ritik0712-ai/Codexa.git
cd Codexa

# Set up backend
cd backend
npm install
cp .env.example .env
# Edit .env with your database URL and OpenAI key
npx prisma generate
npx prisma db push
npm run dev

# Set up frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 to see the app!

## 📁 Project Structure

```
Codexa/
├── frontend/          # Next.js 14 frontend
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── context/   # React contexts
│   │   └── lib/       # Utilities and API
│   └── public/
├── backend/           # Express.js API
│   ├── src/
│   │   ├── routes/    # API routes
│   │   └── services/  # Business logic
│   └── prisma/        # Database schema
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Express.js, TypeScript, Prisma |
| Database | PostgreSQL (Supabase) |
| AI | OpenAI GPT-4 |
| Editor | Monaco Editor |
| Icons | Lucide React |

## 📡 API Endpoints

### Authentication
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

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Render/Railway)
```bash
cd backend
# Connect to Render/Railway and deploy
```

## 📖 Documentation

- [Product Requirements Document](./Documents/AI_Code_Review_Assistant_PRD.docx)
- [Technical Requirements Document](./Documents/AI_Code_Review_Assistant_TRD.docx)
- [UI/UX Design Brief](./Documents/AI_Code_Review_Assistant_UI_UX_Design_Brief.docx)
- [2-Day Implementation Plan](./Documents/AI_Code_Review_Assistant_2_Day_Implementation_Plan.docx)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Ritik Agarwal**

Built with ❤️ for the developer community

---

⭐ Star this repo if you find it useful!
