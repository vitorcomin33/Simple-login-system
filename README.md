# Simple Login System

A simple login system made by openclaw. I'm using that project to improve my learning on Frameworks, APIs, Database, Front-end and Back-end.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, SQLite, Bcryptjs

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/vitorcomin33/Simple-login-system.git
cd Simple-login-system
```

### 2. Backend Setup
```bash
cd backend
npm install
node server.js
```
The API will start on `http://localhost:3001`.

### 3. Frontend Setup
```bash
# Open a new terminal in the root folder
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

## Features
- **Secure Authentication:** Passwords are encrypted using Bcrypt.
- **Minimalist UI:** Clean, responsive design focused on user experience.
- **Zero-Config DB:** SQLite database is initialized automatically on the first run.
- **Fast Development:** Powered by Vite for near-instant hot module replacement.

## Known Limitations
- **Session Persistence:** The current login endpoint validates the user's email and password but does not create an authenticated session. Session management and persistent authentication will be implemented in a future version.
- **Password Security:** Passwords are hashed using `bcryptjs` before being stored in the database. Passwords are never stored as plain text.
