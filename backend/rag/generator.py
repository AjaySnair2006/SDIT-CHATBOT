import os
import re
from typing import Any, Optional

from config import GEMINI_API_KEY, MODEL_NAME, MIN_SIMILARITY_SCORE
from rag.classifier import classify_intent

GREETING_PATTERNS = [
    r"^(hi|hello|hey|greetings|howdy|good\s+(morning|afternoon|evening))\b",
    r"\b(namaskara|namaskaram|namaste|vannakam)\b",
    r"(ನಮಸ್ಕಾರ|ಹಲೋ|നമസ്കാരം|नमस्ते)"
]

IDENTITY_PATTERNS = [
    r"\b(who\s+are\s+you|what\s+is\s+your\s+name|what\s+can\s+you\s+do|introduce\s+yourself)\b",
    r"(ಯಾರು\s*ನೀವು|ನಿಮ್ಮ\s*ಹೆಸರೇನು|നിങ്ങൾ\s*ആരാണ്|आप\s*कौन\s*हैं)"
]

THANKS_PATTERNS = [
    r"\b(thank\s+you|thanks|thankyou|thx|appreciate\s+it|dhanyavada|dhanyavad|nanni)\b",
    r"(ಧನ್ಯವಾದ|നന്ദി|धन्यवाद)"
]

FALLBACK_MESSAGE = (
    "I couldn't find specific details for your query in the current SDIT knowledge base.\n\n"
    "Here are some common topics I can assist you with:\n"
    "- **01. College Info**: History under Shree Devi Education Trust, vision, VTU affiliation, and campus map.\n"
    "- **02. Departments & Courses**: B.E. (CSE, AIML, Data Science, ISE, ECE, Aeronautical, Civil, ME), MBA, MCA, and faculty/HODs.\n"
    "- **03. Admissions & Academics**: Eligibility, KCET code (**E146**), PGCET codes (MBA **B281**, MCA **C476**, M.Tech **T868**), fees, SSP/NSP scholarships, and VTU exams.\n"
    "- **04. Events & Fests**: Cultural fest **'Sambram'**, hackathons, and clubs (IEEE, Robotics, Coding, NSS, Red Cross).\n"
    "- **05. Facilities**: Central Library (16,000+ volumes, DELNET, NDLI), Hostels (boys/girls, mess), Cafeteria, and Bus routes.\n"
    "- **06. Placements**: Training roadmap and recruiters like Amazon, Infosys, TCS, Wipro, DXC, and ICICI Bank.\n"
    "- **07. Student Support**: Leave application procedure, hall tickets, and grievance portal.\n\n"
    "For direct administrative assistance, contact the SDIT office at **0824-2254103** / **+91 824 2254111** or visit **[www.sdit.ac.in](https://www.sdit.ac.in)**."
)


class ResponseGenerator:
    """
    Synthesizes chatbot responses using local intelligence or optional Generative AI (Gemini).
    Guarantees zero-dependency offline functionality by default with multilingual and persona support.
    """

    def __init__(self):
        self.gemini_client = None
        if GEMINI_API_KEY:
            self._init_gemini()

    def _init_gemini(self):
        """Initializes Google Gemini API client if API key is present."""
        try:
            from google import genai
            self.gemini_client = genai.Client(api_key=GEMINI_API_KEY)
            print("[RAG] Google Gemini client initialized successfully.")
        except Exception as e:
            print(f"[RAG] Could not initialize Gemini client: {e}. Falling back to local synthesis.")
            self.gemini_client = None

    def generate(
        self,
        question: str,
        retrieval_result: dict[str, Any],
        user_type: Optional[str] = "visitor",
        language: Optional[str] = "en"
    ) -> dict[str, Any]:
        """
        Generates final answer, category, and sources for the user query.
        Supports personas (student, faculty, visitor) and language settings.
        """
        trimmed = question.strip()
        lower_q = trimmed.lower()

        # 1. Check for basic greetings (multilingual)
        for pat in GREETING_PATTERNS:
            if re.search(pat, lower_q):
                greeting_text = self._build_greeting(user_type, lower_q)
                return {
                    "answer": greeting_text,
                    "category": "general",
                    "sources": ["SDIT Knowledge Base"]
                }

        # 2. Check for identity queries
        for pat in IDENTITY_PATTERNS:
            if re.search(pat, lower_q):
                return {
                    "answer": (
                        "I am **SDIT SmartBot**, the dedicated AI assistant for Shree Devi Institute of Technology (SDIT), Kenjar, Mangaluru.\n\n"
                        "I can assist you with verified information across 7 key areas:\n"
                        "1. **College Overview** (History, Vision, Mission, Affiliations)\n"
                        "2. **Departments & Courses** (B.E., MBA, MCA, M.Tech, Faculty & HODs)\n"
                        "3. **Admissions & Academics** (KCET Code **E146**, Eligibility, Scholarships, Calendar)\n"
                        "4. **Events & Fests** ('Sambram' Cultural Fest, Technical Clubs, IEEE, NSS)\n"
                        "5. **Campus Facilities** (Library with DELNET/NDLI, Hostels, Bus Routes, Cafeteria)\n"
                        "6. **Placements** (Amazon, Infosys, TCS, Wipro, Training Roadmap)\n"
                        "7. **Student Support** (Leave procedure, Grievances, Anti-Ragging, Helpdesk)"
                    ),
                    "category": "general",
                    "sources": ["SDIT Knowledge Base"]
                }

        # 3. Check for thanks/appreciation
        for pat in THANKS_PATTERNS:
            if re.search(pat, lower_q):
                return {
                    "answer": "You're very welcome! If you have any more questions about SDIT, feel free to ask anytime. Best wishes! 😊",
                    "category": "general",
                    "sources": ["SDIT Knowledge Base"]
                }

        # Determine category
        detected_category = classify_intent(trimmed)
        if detected_category == "general" and retrieval_result.get("category"):
            detected_category = retrieval_result["category"]

        if retrieval_result.get("category") == "events":
            detected_category = "events"

        score = retrieval_result.get("score", 0.0)
        best_chunk = retrieval_result.get("best_chunk")
        context_text = retrieval_result.get("context_text", "")
        sources = retrieval_result.get("sources", ["SDIT Knowledge Base"])

        # If similarity score is very low and no exact FAQ matched
        if score < MIN_SIMILARITY_SCORE or not best_chunk:
            return {
                "answer": FALLBACK_MESSAGE,
                "category": detected_category,
                "sources": ["SDIT Administration (sdit.ac.in)"]
            }

        # 4. If Gemini API is enabled, use LLM generation grounded in retrieved context
        if self.gemini_client and context_text:
            llm_answer = self._generate_with_gemini(trimmed, context_text, user_type)
            if llm_answer:
                return {
                    "answer": llm_answer,
                    "category": detected_category,
                    "sources": sources
                }

        # 5. Local structured synthesis (Default offline mode)
        answer = self._synthesize_local(trimmed, retrieval_result, user_type)
        return {
            "answer": answer,
            "category": detected_category,
            "sources": sources
        }

    def _build_greeting(self, user_type: Optional[str], lower_q: str) -> str:
        """Constructs a customized, friendly greeting."""
        is_kannada = "ನಮಸ್ಕಾರ" in lower_q or "namaskara" in lower_q
        is_malayalam = "നമസ്കാരം" in lower_q or "namaskaram" in lower_q
        is_hindi = "नमस्ते" in lower_q or "namaste" in lower_q

        if is_kannada:
            return (
                "ನಮಸ್ಕಾರ! 🙏 ನಾನು **SDIT SmartBot**, ಶ್ರೀ ದೇವಿ ಇನ್‌ಸ್ಟಿಟ್ಯೂಟ್ ಆಫ್ ಟೆಕ್ನಾಲಜಿ (SDIT) ಕೆಂಜಾರು, ಮಂಗಳೂರಿನ ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಸಹಾಯಕ.\n\n"
                "ನೀವು ಪ್ರವೇಶಗಳು (KCET ಕೋಡ್: **E146**), ಕೋರ್ಸ್‌ಗಳು, ಹಾಸ್ಟೆಲ್, ಬಸ್ ಸಾರಿಗೆ ಮತ್ತು ಪ್ಲೇಸ್‌ಮೆಂಟ್‌ಗಳ ಕುರಿತು ವಿಚಾರಿಸಬಹುದು. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?"
            )
        elif is_malayalam:
            return (
                "നമസ്കാരം! 🙏 ഞാൻ **SDIT SmartBot**, ശ്രീ ദേവി ഇൻസ്റ്റിറ്റ്യൂട്ട് ഓഫ് ടെക്നോളജി (SDIT) കെഞ്ചാർ, മംഗലാപുരത്തിന്റെ ഡിജിറ്റൽ അസിസ്റ്റന്റ്.\n\n"
                "അഡ്മിഷൻ, കോഴ്സുകൾ, ഹോസ്റ്റൽ, ബസ് സൗകര്യങ്ങൾ, പ്ലേസ്‌മെന്റ് എന്നിവയെക്കുറിച്ച് ചോദിക്കാം. എനിക്ക് എങ്ങിനെ സഹായിക്കാനാകും?"
            )
        elif is_hindi:
            return (
                "नमस्ते! 🙏 मैं **SDIT SmartBot**, श्री देवी इंस्टीट्यूट ऑफ टेक्नोलॉजी (SDIT) केंजार, मंगलुरु का आधिकारिक सहायक हूँ।\n\n"
                "आप प्रवेश (KCET कोड: **E146**), पाठ्यक्रम, छात्रावास, बस परिवहन और प्लेसमेंट के बारे में पूछ सकते हैं। मैं आपकी क्या सहायता कर सकता हूँ?"
            )

        persona_note = ""
        if user_type == "student":
            persona_note = "As an SDIT student, you can ask about exam calendars, leave forms, hall tickets, or fests!\n\n"
        elif user_type == "faculty":
            persona_note = "Welcome Faculty Member! Feel free to ask about academic calendars, committee links, or departments.\n\n"

        return (
            "Hello! 👋 I'm **SDIT SmartBot**, your official AI assistant for **Shree Devi Institute of Technology (SDIT)**, Kenjar, Mangaluru.\n\n"
            f"{persona_note}"
            "Here is what you can ask me about:\n"
            "- **Admissions & KCET Code** (KCET: **E146**, PGCET: **B281** / **C476**, Eligibility, Scholarships)\n"
            "- **Courses & Departments** (B.E., MBA, MCA, M.Tech, Faculty & HODs)\n"
            "- **Campus Facilities** (Central Library, Hostels, Bus Routes, Cafeteria, Gym)\n"
            "- **Placements & Recruiters** (Amazon, Infosys, TCS, Wipro, Training)\n"
            "- **Events & Fests** (Annual Cultural Fest **'Sambram'**, Technical Clubs, Sports)\n"
            "- **Student Helpdesk** (Leave applications, Grievances, Anti-Ragging, Contacts)\n\n"
            "How can I help you today?"
        )

    def _synthesize_local(self, question: str, retrieval_result: dict[str, Any], user_type: Optional[str]) -> str:
        """
        Synthesizes a clean, well-formatted response from the retrieved knowledge passages.
        """
        top_chunks = retrieval_result.get("top_chunks", [])
        if not top_chunks:
            return FALLBACK_MESSAGE

        recruiter_terms = {
            "recruit", "recruits", "recruiter", "recruiters", "hiring",
            "hire", "employer", "employers", "company", "companies"
        }
        question_words = set(re.findall(r"\w+", question.lower()))
        if question_words.intersection(recruiter_terms):
            placement_chunks = [
                chunk for chunk in top_chunks
                if chunk.get("category") == "placements"
            ]
            best = max(
                placement_chunks or top_chunks,
                key=lambda chunk: chunk.get("score", 0.0)
            )
        else:
            best = top_chunks[0]

        # If best chunk is FAQ or knowledge item with detailed content
        if best.get("type") in ("faq", "knowledge"):
            return best.get("content", "")

        # If best chunk is a document passage
        content = best.get("content", "").strip()
        title = best.get("title", "")

        if title and not content.startswith(title):
            return f"### {title}\n\n{content}"

        return content

    def _generate_with_gemini(self, question: str, context: str, user_type: Optional[str]) -> Optional[str]:
        """Calls Google Gemini with retrieved SDIT context."""
        try:
            prompt = (
                "You are SDIT SmartBot, the official friendly AI assistant for Shree Devi Institute of Technology (SDIT), Kenjar, Mangaluru.\n"
                f"User Persona: {user_type or 'general visitor'}\n"
                "Answer the user's question accurately based ONLY on the provided college context.\n"
                "Formatting Guidelines:\n"
                "- Write in clear, polite, and welcoming tone.\n"
                "- Format key details with bullet points and bold headers for readability.\n"
                "- Include relevant official codes (e.g. KCET Code E146) or contacts if applicable.\n"
                "- Do NOT invent or extrapolate facts not present in the context.\n"
                "- If the context does not have the answer, politely state that and suggest contacting the college office at 0824-2254103.\n\n"
                f"Context from SDIT Knowledge Base:\n{context}\n\n"
                f"User Question: {question}\n\n"
                "Answer:"
            )

            response = self.gemini_client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"[RAG] Gemini generation error: {e}. Reverting to local knowledge synthesis.")

        return None
