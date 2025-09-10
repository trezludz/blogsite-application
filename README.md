# 📝 Blog Platform (Flask + Next.js)

A simple full-stack blog application with authentication, posts, and comments.  
Backend is built with **Flask**, frontend with **Next.js (React + TypeScript)**.

---

## 🚀 Features
- 🔐 User authentication (JWT)
- ✍️ Create, update, delete blog posts
- 💬 Add, edit, delete comments
- 👀 Track post views
- 📊 Popular & recent posts (cached with Redis)

---

## ⚙️ Backend Setup (Flask)

### 1. Install Python
Make sure you have **Python 3.14** installed.

### 2. Create a virtual environment
python -m venv venv
Activate it:

Windows:
venv\Scripts\activate

macOS/Linux:
source venv/bin/activate

3. Install dependencies

pip install -r requirements.txt

4. Run the backend server
flask run
By default, the backend runs on:
http://localhost:5000

🎨 Frontend Setup (Next.js)
1. Install Node.js
Make sure you have Node.js (>=18) installed.

2. Navigate to frontend
cd frontend/frontend

4. Install dependencies
npm install

6. Run the frontend server
npm run dev

Frontend runs on:
http://localhost:3000

📂 Project Structure
```
├── backend/              # Flask backend
│   ├── app.py            # App entry
│   ├── auth.py           # Auth routes (login, signup, refresh)
│   ├── routes.py         # Blog & comment routes
│   ├── models.py         # Database models
│   └── requirements.txt  # Python dependencies
│
└── frontend/             # Next.js frontend
    ├── frontend/         # Next.js app directory
    ├── components/       # React components
    ├── lib/api.ts        # API wrapper
    └── package.json      # Node dependencies
```
✅ Usage
- Start the backend (flask run)
- Start the frontend (npm run dev)
- Open your browser at http://localhost:3000

🔮 Roadmap
- Add user profile pages
- Implement input validation and user prompts
- Deploy to production (Docker + CI/CD)
