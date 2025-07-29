# AI React Component Generator

An intelligent web application that generates React components using AI, featuring user authentication, session management, and context-aware code generation.

## 🚀 Features

- **AI-Powered Component Generation**: Generate React components using GPT-4o-mini through OpenRouter API
- **User Authentication**: Secure signup/signin with JWT tokens and Google OAuth integration
- **Session Management**: Organize your AI conversations into manageable sessions
- **Context-Aware Chat**: AI remembers previous conversations for better code generation
- **Code Extraction**: Automatically separates JSX and CSS from generated responses
- **Real-time Generation**: Fast component creation with immediate preview

## 🛠️ Tech Stack

**Backend:**
- Node.js with Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Google OAuth 2.0
- bcrypt for password hashing

**Frontend:**
- Next.js
- TypeScript
- ShadCN
- Tailwind

**External Services:**
- OpenRouter AI API (GPT-4o-mini)
- Google OAuth 2.0

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- npm
- PostgreSQL database
- Google OAuth credentials
- OpenRouter API key

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/kshitij-y/component.git
cd component
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_generator"

# JWT Secret
JWT_SECRET="your-super-secure-jwt-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenRouter API
OPENROUTER_API_KEY="your-openrouter-api-key"

# Server Configuration
PORT=5000
NODE_ENV=development
```

4. **Database Setup**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## 🚀 Running the Application

1. **Start the backend server**
```bash
cd backend
npm run dev
```

2. **Start the frontend application**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── sessionController.ts
│   │   │   ├── chatController.ts
│   │   │   └── componentController.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── sendResponse.ts
│   │   │   └── extract.ts
│   │   ├── middleware/
│   │   └── routes/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/oauth` - Google OAuth login
- `GET /auth/me` - Get current user
- `POST /auth/signout` - User logout

### Session Management
- `POST /sessions` - Create new session
- `GET /sessions` - List user sessions
- `GET /sessions/:id` - Get session details
- `PUT /sessions/:id` - Update session title
- `DELETE /sessions/:id` - Delete session

### AI Generation
- `POST /chat` - Context-aware AI chat
- `POST /generate` - Standalone component generation

## 🗄️ Database Schema

### Users Table
```sql
- id: String (Primary Key)
- name: String (Optional)
- email: String (Unique)
- password: String (Optional - for OAuth users)
- provider: String (Optional - 'google')
- providerId: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

### Sessions Table
```sql
- id: String (Primary Key)
- title: String
- userId: String (Foreign Key)
- createdAt: DateTime
- updatedAt: DateTime
```

### Chats Table
```sql
- id: String (Primary Key)
- sessionId: String (Foreign Key)
- prompt: String
- jsx: String
- css: String
- createdAt: DateTime
```

## 🔐 Authentication Flow

1. **Regular Signup/Signin**
   - User provides email/password
   - Password is hashed using bcrypt
   - JWT token is generated and stored in HTTP-only cookie

2. **Google OAuth**
   - User authorizes with Google
   - ID token is verified
   - User is created/found in database
   - JWT token is generated

## 🤖 AI Generation Process

1. User sends a prompt through the chat interface
2. System retrieves previous chat context from the session
3. Context + new prompt is sent to OpenRouter API
4. AI generates React component code
5. Response is parsed to extract JSX and CSS
6. Generated code is saved to database and returned to user



## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs

### OpenRouter API Setup
1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Generate API key
3. Add to environment variables



## 🔮 Future Enhancements

- [ ] Component preview functionality
- [ ] Export to CodeSandbox/StackBlitz
- [ ] Component templates library
- [ ] Real-time collaboration
- [ ] Advanced AI model selection
- [ ] Component version history
- [ ] Dark/Light theme toggle

---
