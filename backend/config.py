import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from the backend directory
BACKEND_DIR = Path(__file__).resolve().parent
load_dotenv(BACKEND_DIR / ".env")

# Server Configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# Allowed CORS Origins (Next.js default: http://localhost:3000)
CORS_ORIGINS_RAW = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,*"
)
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_RAW.split(",") if origin.strip()]

# Data Paths
DATA_DIR = BACKEND_DIR / "data"
KNOWLEDGE_FILE = DATA_DIR / "sdit_knowledge.json"
FAQ_FILE = DATA_DIR / "sdit_faq.json"
DOCS_DIR = DATA_DIR / "documents"

# AI / LLM Configuration (Optional)
# If GEMINI_API_KEY or OPENAI_API_KEY is provided, RAG will generate synthesized responses.
# If no key is set, the system uses high-accuracy local retrieval and template synthesis (100% offline).
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-1.5-flash")

# RAG / Retrieval Thresholds
MIN_SIMILARITY_SCORE = float(os.getenv("MIN_SIMILARITY_SCORE", "0.15"))
TOP_K_DOCUMENTS = int(os.getenv("TOP_K_DOCUMENTS", "3"))
