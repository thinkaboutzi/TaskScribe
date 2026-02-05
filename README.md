# TaskScribe 📝⚡  
**AI-Powered Meeting → Task Management SaaS**

TaskScribe is a full-stack web application that automatically converts **meeting transcripts into structured, actionable tasks** using a Large Language Model (LLM). It helps teams capture decisions, track ownership, and maintain momentum after meetings.

This project was built as a **production-style SaaS**, not a demo — with authentication, persistence, AI extraction, and deployment-ready architecture.

---

## ✨ Features

### 🔐 Authentication
- Secure user registration & login
- JWT-based authentication
- Per-user task isolation

### 🤖 AI Task Extraction
- Converts raw meeting transcripts into tasks
- Extracts:
  - Task description
  - Owner
  - Deadline
  - Priority
- Uses **Groq-hosted LLMs** with **structured JSON prompting** for high accuracy
- Ignores filler discussion, questions, and non-commitments

### 📋 Task Management
- View all extracted tasks
- Edit tasks (description, owner, deadline, priority)
- Mark tasks complete / reopen
- Delete individual tasks
- **Delete all tasks** (useful for testing)
- Timestamps (`created_at`, `updated_at`)

### 🎨 Modern UI / UX
- Dark-mode SaaS interface
- Glassmorphism & gradient styling
- Responsive layout
- Toast notifications & confirmation dialogs
- Empty states and loading states

---

## 🧠 How Task Extraction Works

Instead of brittle regex or rule-based NLP, TaskScribe uses:

- **Groq API**
- **LLaMA-3.3-70B (versatile)** model
- **JSON-structured prompting** to enforce deterministic outputs

### Why JSON prompting?
- Precise control over model behavior
- Consistent, machine-parsable output
- Easy validation and post-processing
- Production-grade reliability

---

## 🏗️ Tech Stack

### Frontend
- React
- Bootstrap (dark theme)
- Axios
- Vercel (deployment)

### Backend
- FastAPI
- SQLAlchemy
- JWT Authentication (`python-jose`)
- Groq Python SDK
- Render (deployment)

### AI / LLM
- Groq API
- `llama-3.3-70b-versatile`
- Structured JSON prompting

---