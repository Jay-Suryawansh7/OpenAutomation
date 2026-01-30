# OpenAutomation

Instagram Automation SaaS - Automatically respond to comments with personalized DMs.

## 🚀 Features

- **Webhook Integration** - Receives Instagram comments in real-time via Meta Graph API
- **Keyword Detection** - Triggers automations based on comment keywords (link, guide, me, etc.)
- **Private Replies** - Sends personalized DMs to commenters automatically
- **Clerk Authentication** - Secure user authentication for dashboard
- **Neon PostgreSQL** - Serverless database for storing leads and conversations
- **Keep-Alive** - Self-ping mechanism for Render free tier deployment

## 📁 Project Structure

```
OpenAutomation/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.jsx
│   └── package.json
│
├── server/          # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js
│   ├── render.yaml
│   └── package.json
│
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Clerk React (Authentication)
- Lucide Icons

### Backend
- Node.js
- Express.js
- Clerk Express (Authentication)
- PostgreSQL (Neon)
- Axios

## ⚙️ Environment Variables

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Server (`server/.env`)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_test_...
META_VERIFY_TOKEN=your_verify_token
IG_ACCESS_TOKEN=your_instagram_token
APP_URL=https://your-app.onrender.com
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn
- Neon PostgreSQL account
- Clerk account
- Meta Developer account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jay-Suryawansh7/OpenAutomation.git
   cd OpenAutomation
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../client
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy example files and fill in your values
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

4. **Initialize database**
   ```bash
   cd server
   npm run db:init
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check (keep-alive) |
| GET | `/webhook` | Meta verification challenge |
| POST | `/webhook` | Receive Instagram events |
| GET | `/api/health` | Protected health check |
| GET | `/api/automations` | List automations |

## 🔧 Deployment

### Render (Backend)
1. Connect GitHub repo
2. Render auto-detects `render.yaml`
3. Set environment variables in dashboard
4. Deploy!

### Vercel/Netlify (Frontend)
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

## 📝 License

ISC

## 👤 Author

Jay Suryawanshi
