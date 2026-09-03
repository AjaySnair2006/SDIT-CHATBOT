from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import config
from rag.retriever import KnowledgeRetriever
from rag.generator import ResponseGenerator

# Global RAG components
retriever: Optional[KnowledgeRetriever] = None
generator: Optional[ResponseGenerator] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes RAG retriever and response generator at server startup."""
    global retriever, generator
    print("[Startup] Initializing SDIT Knowledge Retriever...")
    retriever = KnowledgeRetriever()
    print("[Startup] Initializing SDIT Response Generator...")
    generator = ResponseGenerator()
    print("[Startup] SDIT SmartBot Backend is ready to serve requests.")
    yield
    print("[Shutdown] SDIT SmartBot Backend shutting down.")


app = FastAPI(
    title="SDIT SmartBot API",
    description="Backend API and RAG engine for Shree Devi Institute of Technology (SDIT), Kenjar, Mangaluru",
    version="1.1.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request and Response schemas
class ChatRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        description="The question or prompt submitted by the user",
        examples=["What courses are available at SDIT?"]
    )
    user_type: Optional[str] = Field(
        default="visitor",
        description="Optional persona: student, faculty, visitor, prospective_student"
    )
    language: Optional[str] = Field(
        default="en",
        description="Optional ISO language code: en, kn (Kannada), ml (Malayalam), hi (Hindi)"
    )


class ChatResponse(BaseModel):
    answer: str
    category: Optional[str] = None
    sources: Optional[list[str]] = None


@app.get("/")
@app.get("/health")
def health_check():
    """Health check endpoint to verify backend status and dataset readiness."""
    total_chunks = len(retriever.all_chunks) if retriever else 0
    mode = "gemini_rag" if (generator and generator.gemini_client) else "local_intelligent_retriever"

    return {
        "status": "ok",
        "service": "SDIT SmartBot Backend",
        "college": "Shree Devi Institute of Technology, Kenjar, Mangaluru",
        "official_website": "https://www.sdit.ac.in",
        "kcet_code": "E146",
        "pgcet_codes": {
            "mba": "B281",
            "mca": "C476",
            "mtech": "T868"
        },
        "mode": mode,
        "indexed_chunks": total_chunks,
        "api_endpoint": "POST /ask"
    }


@app.post("/ask", response_model=ChatResponse, status_code=status.HTTP_200_OK)
def ask(req: ChatRequest):
    """
    Main endpoint consumed by the frontend.
    Accepts: { "question": "...", "user_type": "student", "language": "en" }
    Returns: { "answer": "...", "category": "...", "sources": [...] }
    """
    question = req.question.strip()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty or blank."
        )

    if not retriever or not generator:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="SDIT Knowledge Engine is not initialized."
        )

    try:
        # Retrieve relevant passages from SDIT dataset
        retrieval_result = retriever.search(question)

        # Generate synthesized response with persona & language hints
        result = generator.generate(
            question=question,
            retrieval_result=retrieval_result,
            user_type=req.user_type,
            language=req.language
        )

        return ChatResponse(
            answer=result["answer"],
            category=result.get("category"),
            sources=result.get("sources")
        )
    except Exception as e:
        print(f"[Error] Exception processing question '{question}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating response: {str(e)}"
        )


@app.get("/categories")
def get_categories():
    """Returns list of all supported knowledge categories."""
    return {
        "categories": [
            {"id": "admissions", "name": "Admissions, KCET (E146) & Academics"},
            {"id": "courses", "name": "Departments, Faculty & Programmes"},
            {"id": "facilities", "name": "Campus Facilities, Library & Hostels"},
            {"id": "placements", "name": "Training & Placements"},
            {"id": "clubs", "name": "Student Clubs, 'Sambram' & Extracurriculars"},
            {"id": "research", "name": "Research & Incubation Centres"},
            {"id": "general", "name": "College Info, Grievances & Helpdesk"}
        ]
    }


@app.post("/reload")
def reload_knowledge():
    """Hot-reloads all dataset files without needing a server restart."""
    global retriever
    if retriever:
        retriever.load_and_index()
        return {
            "status": "success",
            "message": f"Reloaded {len(retriever.all_chunks)} knowledge passages successfully."
        }
    return {"status": "error", "message": "Retriever not initialized."}
