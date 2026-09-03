# SDIT SmartBot — Technical Architecture & Presentation Guide

> **College Event Presentation Guide**  
> **Project Name**: SDIT SmartBot (Official AI College Information Assistant)  
> **Institution**: Shree Devi Institute of Technology (SDIT), Kenjar, Mangaluru  
> **Event**: College Tech Bot Event / Project Presentation  

---

## 1. Executive Summary

**SDIT SmartBot** is a high-speed, dual-mode AI college assistant designed specifically for Shree Devi Institute of Technology. It bridges the communication gap for prospective students, parents, current undergraduates, and faculty by providing instant, verified answers regarding admissions (KCET Code: **E146**), courses, campus facilities, placements, student clubs, and administrative support.

---

## 2. Technical Stack Comparison & Rationale

When architecting a college chatbot, three main architectural paradigms were evaluated:

| Architectural Metric | Next.js 14 + FastAPI + RAG (Our Choice) | Google Dialogflow | Streamlit / Gradio |
| :--- | :--- | :--- | :--- |
| **Frontend Flexibility** | **Production-grade UI/UX** with dark mode, animations, voice recognition, and responsive mobile rails. | Embedded iframe or widget; very rigid styling and branding constraints. | Basic rapid prototyping layout; lacks rich consumer mobile app feel. |
| **Backend Independence** | **High-performance async Python FastAPI** with standard REST endpoints (`POST /ask`). | Proprietary cloud platform; requires active Google Cloud account and billing. | Python UI coupled directly to the server; hard to separate teammate responsibilities. |
| **Offline / Zero Cost** | **100% Offline Capable** out-of-the-box using TF-IDF + n-gram indexing without external API keys. | Requires continuous cloud connectivity and API quotas. | Dependent on backend scripts; UI does not scale well to multiple concurrent users. |
| **Hallucination Control** | **Strict Grounding**: Synthesizes responses strictly from verified `sdit.ac.in` datasets. | Rule-based intent trees; struggles with long reference documents. | Prone to raw LLM hallucinations without custom RAG pipelines. |
| **Extensibility** | **Dual-Mode Engine**: Runs offline locally, or switches to Gemini/OpenAI if an API key is provided. | Locked into Dialogflow agent ecosystem. | Monolithic execution model. |

---

## 3. High-Level System Architecture

```
+-------------------------------------------------------------------------+
|                           CLIENT TIER (Frontend)                        |
|                                                                         |
|   Next.js 14 (App Router) + TypeScript + Tailwind CSS                   |
|   - Mobile Drawer & Responsive Rail Navigation                          |
|   - Real-time Markdown Formatter (Bold, Lists, Headings)                |
|   - Web Speech API (Client-side Voice Recognition)                      |
|   - Multilingual Switcher (English, Kannada, Malayalam, Hindi)          |
+------------------------------------+------------------------------------+
                                     |
                          HTTP POST /ask JSON Payload
                          { question, user_type, language }
                                     |
                                     v
+-------------------------------------------------------------------------+
|                        APPLICATION TIER (FastAPI)                       |
|                                                                         |
|   FastAPI REST Engine (Uvicorn Async Worker, Port 8000)                 |
|   - CORS Middleware (Whitelisting localhost:3000 & 127.0.0.1)           |
|   - Intent & Category Classifier (Admissions, Courses, Facilities, etc.)|
|   - Lifecycle Startup Hooks (Pre-compiling knowledge TF-IDF matrices)   |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                           RAG INTELLIGENCE TIER                         |
|                                                                         |
|   1. Knowledge Retriever:                                               |
|      - TF-IDF Vectorizer with Sublinear Term Frequency                  |
|      - Unigram + Bigram Contextual Window                               |
|      - Cosine Similarity + Keyword Boosting                             |
|      - Direct High-Confidence FAQ Matching                              |
|                                                                         |
|   2. Response Generator (Dual-Mode):                                    |
|      - Mode A (Default): Local Structured Synthesis (100% Offline)       |
|      - Mode B (Optional): Google Gemini Generative RAG                  |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                           DATA TIER (Datasets)                          |
|                                                                         |
|   - sdit_knowledge.json: Structured knowledge base                      |
|   - sdit_faq.json: High-frequency query pairs                           |
|   - documents/ (01_college_info, 02_departments, 03_admissions, etc.)   |
+-------------------------------------------------------------------------+
```

---

## 4. The 9 Core Functional Modules (Based on `sdit.ac.in`)

1. **01. College Information**:
   - Shree Devi Education Trust history, Chairman Sri A. Sadananda Shetty.
   - VTU Belagavi Affiliation, AICTE Approval, Govt. of Karnataka Recognition.
   - Vision, Mission, and Kenjar campus landscape layout.
2. **02. Departments & Courses**:
   - B.E. in CSE, AIML, Data Science, ISE, ECE, Aeronautical, Civil, Mechanical.
   - Post-graduate MBA, MCA, and M.Tech in Construction Technology.
   - Key Faculty & HODs (Principal Dr. Manujesh B. J., Vice Principal Dr. Nethravathi P. S., HODs Prof. Anand S. Uppar, Prof. Chitra Prabhu, Prof. Sudheer Kumar B. N.).
3. **03. Admissions & Academics**:
   - Official Counseling Codes: **KCET Code: E146**, **MBA PGCET: B281**, **MCA PGCET: C476**, **M.Tech PGCET: T868**.
   - B.E. Eligibility: 10+2 with Physics & Math (45% General, 40% Reserved).
   - Fee structure and government scholarships (SSP, NSP, Trust concessions).
   - VTU Academic Calendar and exam results portal (`results.vtu.ac.in`).
4. **04. Events & Fests**:
   - Annual Cultural Fest **'Sambram'** (dance, music, bands, fine arts).
   - Technical symposia, 24-hour hackathons, and national workshops.
   - Student clubs: IEEE Student Branch, Coding Club, Robotics & IoT, CSI, NSS, and Youth Red Cross.
5. **05. Campus Facilities**:
   - Central Library: 16,000+ volumes, DELNET, NDLI, and IEEE Xplore access (8:30 AM – 6:00 PM).
   - Hostels: Separate for boys and girls, 7:30 PM gate curfew, 24/7 security, resident wardens, and dining mess.
   - Transport: Bus network covering Mangaluru, Surathkal, Moodbidri, Mulki, and Bantwal.
   - Sports Complex, multi-gym, and health centre with emergency medical transport.
6. **06. Placements & Training**:
   - High conversion rate with top packages up to 14+ LPA.
   - Visiting Recruiters: **Amazon, Infosys, TCS, Wipro, Cognizant, DXC Technology, ICICI Bank, SLK Software, Robosoft**.
   - 4-Stage Training Roadmap: Soft skills -> Aptitude -> Coding Bootcamps -> Mock Interviews.
7. **07. Student Assistance**:
   - Leave application protocol (Mentor & HOD approvals).
   - Exam hall tickets, attendance tracking (VTU 85% rule), marks card correction.
   - Grievance Redressal Cell (Online: `sdit.ac.in/grievance/`, Offline: Suggestion Box in Admin Block).
   - Anti-Ragging Committee & official phone directory (**0824-2254103**).
8. **08. Smart Features**:
   - Multilingual interaction support: English, Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Hindi (हिन्दी).
   - Persona identification: Tailored responses for Students vs. Parents/Visitors vs. Faculty.
   - Client-side voice interaction via Web Speech API.
9. **09. Robust Engineering & Security**:
   - Input sanitation, Pydantic type validation, 400 Bad Request error guards.
   - Live knowledge re-indexing via `POST /reload` without downtime.

---

## 5. Live Demo Script for the Event

Use this 3-minute pitch structure when presenting to judges or faculty:

### Minute 1: The Problem & The Solution
> *"Respected judges and faculty, when a new applicant, parent, or current student seeks information about SDIT—such as admission cutoffs, KCET codes, hostel rules, or placement statistics—they often have to hunt through lengthy prospectus PDFs or call administrative desks.  
> We created **SDIT SmartBot**: a purpose-built AI assistant powered by a Next.js 14 frontend and a Python FastAPI Retrieval-Augmented Generation backend, trained on verified data directly from sdit.ac.in."*

### Minute 2: Live Query Demonstration
1. **Admissions & Official Codes**:
   - Ask: *"What is the KCET code and eligibility for B.E. admission at SDIT?"*
   - Highlight: The bot responds with **KCET Code: E146**, 10+2 marks criteria (45% General, 40% Reserved), and PGCET codes (**B281** / **C476**).
2. **Placements & Training**:
   - Ask: *"Which companies visit SDIT for campus placements?"*
   - Highlight: Shows **Amazon, Infosys, TCS, Wipro, Cognizant, ICICI Bank**, plus the 4-tier training roadmap.
3. **Campus Facilities & Student Life**:
   - Ask: *"Tell me about the library, hostel rules, and the college fest."*
   - Highlight: Accurately quotes DELNET/NDLI subscriptions, the 7:30 PM hostel curfew, and the annual cultural fest **'Sambram'**.
4. **Multilingual Greeting**:
   - Type or speak: *"ನಮಸ್ಕಾರ / Namaskara"*
   - Highlight: Bot responds warmly in Kannada and offers college information.

### Minute 3: Tech Stack & Architecture Strengths
> *"What sets our backend apart?  
> First, **zero-cost offline resiliency**: using an optimized TF-IDF semantic vector space, it works anywhere—even with zero internet or API credits.  
> Second, **pluggable Generative AI**: with a single environment variable, it can switch to Google Gemini for generative conversational summaries.  
> Third, **zero hallucination**: every answer is grounded in structured SDIT knowledge with citations."*
