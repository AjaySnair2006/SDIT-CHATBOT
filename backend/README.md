# SDIT SmartBot — Backend & RAG Engine

A FastAPI-powered intelligent backend with Retrieval-Augmented Generation (RAG) and comprehensive datasets for **Shree Devi Institute of Technology (SDIT)**, Kenjar, Mangaluru.

Designed to power the **SDIT SmartBot** chat application.

---

## Features

- **FastAPI Core**: Ultra-fast, async-ready REST API with automatic interactive docs (`/docs`).
- **Dual-Mode AI Response Engine**:
  - **Local Intelligent Retriever Mode (Default)**: Uses TF-IDF semantic indexing, n-gram matching, and structured extraction to answer questions 100% offline with zero API keys or external fees.
  - **Generative RAG Mode (Optional)**: Set `GEMINI_API_KEY` in `.env` to automatically generate conversational responses synthesized from SDIT facts using Google Gemini.
- **Rich SDIT Datasets**: Covers admissions, degree programs (B.E., MBA, MCA), campus facilities, hostels, bus routes, placement training, recruiters, student clubs, cultural fest ('Sambram'), and official contacts.
- **Frontend Compatible**: Pre-configured with CORS and data schemas matching the Next.js frontend (`POST /ask`).
- **Live Knowledge Reloading**: Update datasets and call `POST /reload` to refresh indexed knowledge without restarting the server.

---

## Folder Structure

```
backend/
├── main.py                     # FastAPI application & API routes
├── run.py                      # Server launcher script
├── config.py                   # Configuration & environment variables
├── requirements.txt            # Python dependencies
├── .env.example                # Configuration template
├── .env                        # Active environment variables
│
├── rag/
│   ├── classifier.py           # Intent & category classification
│   ├── retriever.py            # TF-IDF vector index & document search
│   └── generator.py            # Response synthesis (Local & Gemini LLM)
│
└── data/
    ├── sdit_knowledge.json     # Comprehensive structured knowledge base
    ├── sdit_faq.json           # Frequently asked Q&A pairs
    └── documents/              # Markdown reference documents
        ├── about_sdit.md
        ├── admissions_eligibility.md
        ├── courses_curriculum.md
        ├── campus_facilities.md
        ├── placements_training.md
        └── student_clubs_activities.md
```

---

## Setup & Running

### 1. Install Dependencies

From the project root or the `backend` directory, install the required packages:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Backend Server

```bash
python run.py
```
Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start at **http://localhost:8000**.

- Interactive API Docs: **http://localhost:8000/docs**
- Health Check: **http://localhost:8000/health**

---

## API Endpoints

### 1. `POST /ask`
Main query endpoint used by the Next.js chat interface.

**Request Body:**
```json
{
  "question": "What courses are available at SDIT?"
}
```

**Response:**
```json
{
  "answer": "SDIT offers 4-year Bachelor of Engineering (B.E.) degree programs in...\n1. Computer Science & Engineering (CSE)...",
  "category": "courses",
  "sources": [
    "SDIT Academic Bulletin"
  ]
}
```

### 2. `GET /health`
Returns system status, active mode (`local_intelligent_retriever` or `gemini_rag`), and number of indexed chunks.

### 3. `GET /categories`
Lists all supported knowledge categories (`admissions`, `courses`, `facilities`, `placements`, `clubs`, `research`, `general`).

### 4. `POST /reload`
Hot-reloads all dataset files without server downtime.

---

## How to Add or Update Datasets

### Option A: Add a Quick FAQ
Open `data/sdit_faq.json` and add a new entry:
```json
{
  "question": "What is the library opening time?",
  "category": "facilities",
  "answer": "The central library is open Monday to Friday from 8:30 AM to 6:00 PM.",
  "source": "SDIT Central Library"
}
```

### Option B: Add a Knowledge Block
Open `data/sdit_knowledge.json` and add an entry:
```json
{
  "id": "exam_schedule",
  "category": "general",
  "title": "VTU Semester Examinations",
  "keywords": ["exam", "vtu exams", "timetable", "schedule"],
  "questions": ["When are semester exams held?"],
  "content": "Semester examinations are conducted as per the official VTU Belagavi calendar...",
  "source": "VTU Exam Section"
}
```

### Option C: Drop a Markdown Document
Place any `.md` file in `data/documents/` (e.g. `scholarships.md` or `hostel_rules.md`). The retriever will automatically chunk, index, and retrieve from it.

After editing datasets, restart the server or send a `POST /reload` request.

---

## Connecting with the Frontend

1. Ensure the backend is running on `http://localhost:8000`.
2. In the project root, ensure `.env.local` contains:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. Run the Next.js frontend:
   ```bash
   npm run dev
   ```
4. Open **http://localhost:3000** in your browser and start chatting!
