import json
import re
from hashlib import sha256
from pathlib import Path
from typing import Any, Optional
from urllib.parse import urlparse
from urllib.request import Request, urlopen

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from config import (
    DOCS_DIR,
    FAQ_FILE,
    KNOWLEDGE_FILE,
    MIN_SIMILARITY_SCORE,
    PDF_CACHE_DIR,
    PDF_DOWNLOAD_ENABLED,
    PDF_DOWNLOAD_TIMEOUT,
    TOP_K_DOCUMENTS,
)

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover - dependency installation is environment-specific
    PdfReader = None


class KnowledgeRetriever:
    """
    RAG Retriever for SDIT Knowledge Base.
    Indexes structured JSON knowledge items, FAQ pairs, and markdown documentation.
    Uses TF-IDF + n-gram representation with cosine similarity and keyword boosting.
    """

    DEPARTMENT_ALIASES = {
        "computer_science": [
            "computer science and engineering", "computer science engineering",
            "cs engineering", "cse", "computer science"
        ],
        "aiml": [
            "artificial intelligence and machine learning", "aiml", "ai and machine learning",
            "machine learning", "artificial intelligence"
        ],
        "ai_ds": [
            "artificial intelligence and data science", "ai and data science",
            "data science", "ai ds"
        ],
        "ise": [
            "information science and engineering", "information science engineering",
            "ise", "information science"
        ],
        "ece": [
            "electronics and communication engineering", "electronics communication engineering",
            "ece", "electronics and communication", "electronics engineering"
        ],
        "aeronautical": [
            "aeronautical engineering", "aeronautical", "aircraft engineering"
        ],
        "mechanical": [
            "mechanical engineering", "mechanical", "me"
        ],
        "civil": [
            "civil engineering", "civil"
        ],
        "mba": [
            "mba", "master of business administration", "business administration"
        ],
        "mca": [
            "mca", "master of computer applications", "computer applications"
        ],
        "mtech": [
            "mtech", "m tech", "master of technology", "construction technology", "construction tech"
        ],
    }

    DEPARTMENT_TITLE_ALIASES = {
        "computer_science": ["computer science and engineering"],
        "aiml": ["artificial intelligence and machine learning", "aiml"],
        "ai_ds": ["artificial intelligence and data science", "ai ds"],
        "ise": ["information science and engineering"],
        "ece": ["electronics and communication engineering"],
        "aeronautical": ["aeronautical engineering"],
        "mechanical": ["mechanical engineering"],
        "civil": ["civil engineering"],
        "mba": ["business administration", "mba"],
        "mca": ["computer applications", "mca"],
        "mtech": ["m tech and ph d research centers", "master of technology", "construction technology"],
    }

    def __init__(self):
        self.knowledge_items: list[dict[str, Any]] = []
        self.faq_items: list[dict[str, Any]] = []
        self.doc_passages: list[dict[str, Any]] = []
        self.pdf_passages: list[dict[str, Any]] = []
        self.all_chunks: list[dict[str, Any]] = []

        self.vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix = None

        self.load_and_index()

    def load_and_index(self):
        """Loads all datasets and builds the TF-IDF search index."""
        self.knowledge_items = []
        self.faq_items = []
        self.doc_passages = []
        self.pdf_passages = []
        self.all_chunks = []

        linked_pdf_urls: set[str] = set()

        # 1. Load Knowledge JSON
        if KNOWLEDGE_FILE.exists():
            try:
                with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as f:
                    self.knowledge_items = json.load(f)
            except Exception as e:
                print(f"[Warning] Failed to load {KNOWLEDGE_FILE}: {e}")

        # 2. Load FAQ JSON
        if FAQ_FILE.exists():
            try:
                with open(FAQ_FILE, "r", encoding="utf-8") as f:
                    self.faq_items = json.load(f)
            except Exception as e:
                print(f"[Warning] Failed to load {FAQ_FILE}: {e}")

        # 3. Load Markdown documents from DOCS_DIR
        if DOCS_DIR.exists():
            for doc_path in DOCS_DIR.glob("*.md"):
                try:
                    with open(doc_path, "r", encoding="utf-8") as f:
                        text = f.read()
                        self._parse_markdown_into_passages(doc_path.name, text)
                        linked_pdf_urls.update(re.findall(r"https?://[^)\s]+\.pdf(?:\?[^)\s]+)?", text, re.IGNORECASE))
                except Exception as e:
                    print(f"[Warning] Failed to read {doc_path}: {e}")

        self._load_pdf_documents(linked_pdf_urls)

        # Build combined chunk list for search
        # From knowledge items:
        for item in self.knowledge_items:
            # Synthetic search document with repeated keywords for boosted relevance
            search_text = " ".join([
                item.get("title", ""),
                " ".join(item.get("keywords", [])),
                " ".join(item.get("questions", [])),
                item.get("content", "")
            ])
            self.all_chunks.append({
                "type": "knowledge",
                "id": item.get("id"),
                "category": item.get("category", "general"),
                "title": item.get("title", "SDIT Knowledge Base"),
                "content": item.get("content", ""),
                "source": item.get("source", "SDIT Knowledge Base"),
                "citation": item.get("source", "SDIT Knowledge Base"),
                "search_text": search_text,
                "keywords": [kw.lower() for kw in item.get("keywords", [])]
            })

        # From FAQ items:
        for faq in self.faq_items:
            search_text = f"{faq.get('question', '')} {faq.get('answer', '')}"
            self.all_chunks.append({
                "type": "faq",
                "id": f"faq_{len(self.all_chunks)}",
                "category": faq.get("category", "general"),
                "title": faq.get("question", "FAQ"),
                "content": faq.get("answer", ""),
                "source": faq.get("source", "SDIT FAQs"),
                "citation": faq.get("source", "SDIT FAQs"),
                "search_text": search_text,
                "question": faq.get("question", "").lower(),
                "keywords": [w.lower() for w in re.findall(r"\w+", faq.get("question", ""))]
            })

        # From document passages:
        for passage in self.doc_passages:
            self.all_chunks.append(passage)

        # From page-level PDF passages:
        for passage in self.pdf_passages:
            self.all_chunks.append(passage)

        # Build Vectorizer
        corpus = [chunk["search_text"] for chunk in self.all_chunks]
        if corpus:
            self.vectorizer = TfidfVectorizer(
                ngram_range=(1, 2),
                stop_words="english",
                sublinear_tf=True
            )
            self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
            print(
                f"[RAG] Successfully indexed {len(self.all_chunks)} knowledge chunks "
                f"({len(self.pdf_passages)} PDF pages) from SDIT dataset."
            )
        else:
            print("[RAG] Warning: No dataset documents found to index.")

    def _parse_markdown_into_passages(self, filename: str, content: str):
        """Splits markdown file into sections by headings."""
        sections = re.split(r"\n(?=#+\s)", content)
        for i, sec in enumerate(sections):
            sec_trimmed = sec.strip()
            if not sec_trimmed:
                continue
            lines = sec_trimmed.split("\n")
            title = lines[0].replace("#", "").strip() if lines else filename
            body = "\n".join(lines[1:]).strip() if len(lines) > 1 else ""

            if not body or not re.search(r"\w", body):
                continue
            
            # Simple category inference from filename
            cat = "general"
            lower_name = filename.lower()
            if "admission" in lower_name:
                cat = "admissions"
            elif "event" in lower_name:
                cat = "events"
            elif "course" in lower_name:
                cat = "courses"
            elif "facility" in lower_name or "campus" in lower_name:
                cat = "campus"
            elif "placement" in lower_name:
                cat = "placements"
            elif "club" in lower_name:
                cat = "clubs"

            self.doc_passages.append({
                "type": "document",
                "id": f"doc_{filename}_{i}",
                "category": cat,
                "title": title,
                "content": body if body else sec_trimmed,
                "source": f"SDIT Document: {filename}",
                "search_text": sec_trimmed,
                "keywords": [w.lower() for w in re.findall(r"\w+", title)]
            })

    @staticmethod
    def _category_for_filename(filename: str) -> str:
        lower_name = filename.lower()
        if "admission" in lower_name:
            return "admissions"
        if "event" in lower_name:
            return "events"
        if "course" in lower_name or "syllabus" in lower_name or "scheme" in lower_name:
            return "courses"
        if "facility" in lower_name or "campus" in lower_name:
            return "campus"
        if "placement" in lower_name:
            return "placements"
        if "club" in lower_name:
            return "clubs"
        return "general"

    def _load_pdf_documents(self, linked_pdf_urls: set[str]):
        """Indexes local PDFs and downloadable PDF links as page-level passages."""
        if PdfReader is None:
            print("[Warning] pypdf is unavailable; PDF indexing is disabled.")
            return

        local_pdfs = sorted(DOCS_DIR.rglob("*.pdf")) if DOCS_DIR.exists() else []
        for pdf_path in local_pdfs:
            self._parse_pdf_into_passages(pdf_path, f"SDIT PDF: {pdf_path.name}")

        if not PDF_DOWNLOAD_ENABLED:
            return

        for url in sorted(linked_pdf_urls):
            parsed_name = Path(urlparse(url).path).name or "sdit-document.pdf"
            cache_name = f"{sha256(url.encode('utf-8')).hexdigest()[:12]}-{parsed_name}"
            cached_path = PDF_CACHE_DIR / cache_name
            try:
                if not cached_path.exists():
                    PDF_CACHE_DIR.mkdir(parents=True, exist_ok=True)
                    request = Request(url, headers={"User-Agent": "SDIT-SmartBot/1.0"})
                    with urlopen(request, timeout=PDF_DOWNLOAD_TIMEOUT) as response:
                        cached_path.write_bytes(response.read())
                self._parse_pdf_into_passages(cached_path, f"SDIT PDF: {parsed_name}", url)
            except Exception as e:
                print(f"[Warning] Could not index PDF {url}: {e}")

    def _parse_pdf_into_passages(self, pdf_path: Path, source: str, url: Optional[str] = None):
        """Extracts one searchable passage per PDF page and preserves page citations."""
        try:
            reader = PdfReader(str(pdf_path))
            category = self._category_for_filename(pdf_path.name)
            for page_number, page in enumerate(reader.pages, start=1):
                text = re.sub(r"\s+", " ", page.extract_text() or "").strip()
                if not text or not re.search(r"\w", text):
                    continue

                citation = f"{source}, page {page_number}"
                title = f"{pdf_path.stem} - page {page_number}"
                self.pdf_passages.append({
                    "type": "pdf",
                    "id": f"pdf_{pdf_path.stem}_{page_number}",
                    "category": category,
                    "title": title,
                    "content": text,
                    "source": source,
                    "citation": citation,
                    "page": page_number,
                    "url": url,
                    "search_text": f"{title} {text}",
                    "keywords": [w.lower() for w in re.findall(r"\w+", pdf_path.stem)],
                })
        except Exception as e:
            print(f"[Warning] Failed to parse PDF {pdf_path}: {e}")

    def _detect_department(self, query: str) -> Optional[str]:
        """Returns the most relevant department key if the question is department-specific."""
        normalized = re.sub(r"[^a-z0-9&\s]", " ", query.lower())
        normalized = re.sub(r"\s+", " ", normalized).strip()

        aliases = [
            (alias, dept_key)
            for dept_key, department_aliases in self.DEPARTMENT_ALIASES.items()
            for alias in department_aliases
        ]
        for alias, dept_key in sorted(aliases, key=lambda item: len(item[0]), reverse=True):
            if self._alias_matches(alias, normalized):
                return dept_key
        return None

    @staticmethod
    def _alias_matches(alias: str, text: str) -> bool:
        """Matches aliases as complete words, avoiding collisions such as `me` in `tell me`."""
        normalized_alias = re.sub(r"[^a-z0-9]+", " ", alias.lower().replace("&", " and ")).strip()
        normalized_text = re.sub(r"[^a-z0-9]+", " ", text.lower().replace("&", " and ")).strip()
        pattern = rf"(?<![a-z0-9]){re.escape(normalized_alias)}(?![a-z0-9])"
        return re.search(pattern, normalized_text) is not None

    def _department_title_matches(self, chunk: dict[str, Any], dept_key: str) -> bool:
        title = chunk.get("title", "")
        return any(
            self._alias_matches(alias, title)
            for alias in self.DEPARTMENT_TITLE_ALIASES.get(dept_key, [])
        )

    def _chunk_department_hits(self, chunk: dict[str, Any]) -> set[str]:
        """Returns which department keys are explicitly mentioned in a chunk."""
        text = " ".join([
            chunk.get("title", ""),
            chunk.get("content", ""),
            " ".join(chunk.get("keywords", [])),
            chunk.get("source", "")
        ]).lower()

        hits: set[str] = set()
        for dept_key, aliases in self.DEPARTMENT_ALIASES.items():
            for alias in aliases:
                if self._alias_matches(alias, text):
                    hits.add(dept_key)
                    break
        return hits

    def _department_match_score(self, chunk: dict[str, Any], dept_key: str) -> int:
        """Scores whether a chunk is genuinely about the requested department."""
        text = " ".join([
            chunk.get("title", ""),
            chunk.get("content", ""),
            " ".join(chunk.get("keywords", [])),
            chunk.get("source", "")
        ]).lower()

        score = 0
        for alias in self.DEPARTMENT_ALIASES.get(dept_key, []):
            if self._alias_matches(alias, text):
                score += 5

        other_hits = self._chunk_department_hits(chunk) - {dept_key}
        if other_hits:
            score -= 10 + len(other_hits) * 3

        if "all departments" in text or "department details" in text:
            score -= 8
        if "undergraduate (b.e" in text and "computer science" in text and "mba" in text:
            score -= 12
        if "heads of departments" in text and len(other_hits) > 0:
            score -= 10

        if dept_key == "computer_science" and self._alias_matches("computer science & engineering", text):
            score += 2
        if dept_key == "aeronautical" and self._alias_matches("aeronautical engineering", text):
            score += 2
        if dept_key == "mba" and self._alias_matches("master of business administration", text):
            score += 2
        if dept_key == "mca" and self._alias_matches("master of computer applications", text):
            score += 2

        return score

    def search(self, query: str, top_k: int = TOP_K_DOCUMENTS) -> dict[str, Any]:
        """
        Retrieves top matching knowledge chunks for the query.
        Returns matched passages, primary category, sources, and combined context.
        """
        trimmed_query = query.strip().lower()
        if not trimmed_query or not self.vectorizer or self.tfidf_matrix is None:
            return {
                "top_chunks": [],
                "best_chunk": None,
                "category": "general",
                "sources": ["SDIT Knowledge Base"],
                "context_text": "",
                "score": 0.0
            }

        target_department = self._detect_department(trimmed_query)

        # 1. Fast check for high-confidence FAQ exact/near match
        clean_q = re.sub(r"[^\w\s]", "", trimmed_query)
        for faq in self.faq_items:
            faq_q = faq.get("question", "").lower().strip()
            clean_faq = re.sub(r"[^\w\s]", "", faq_q)

            is_match = False
            if clean_q == clean_faq:
                is_match = True
            elif clean_q in ["mission", "what is mission", "what is the mission", "college mission", "sdit mission"] and "mission" in clean_faq and "vision" not in clean_faq:
                is_match = True
            elif clean_q in ["vision", "what is vision", "what is the vision", "college vision", "sdit vision"] and "vision" in clean_faq and "mission" not in clean_faq:
                is_match = True
            elif clean_q in ["history", "what is history", "what is the history", "college history", "sdit history"] and "history" in clean_faq and "mission" not in clean_faq and "vision" not in clean_faq:
                is_match = True
            elif any(w in clean_q for w in ["map", "googlemap"]) and any(w in clean_faq for w in ["map"]):
                is_match = True
            elif any(w in clean_q for w in ["address", "whereis"]) and any(w in clean_faq for w in ["address", "located"]):
                is_match = True
            elif clean_q in clean_faq and len(clean_q) > 12:
                # Avoid matching combined questions when looking for single topic
                if "mission" in clean_q and "vision" not in clean_q and "vision" in clean_faq:
                    pass
                elif "vision" in clean_q and "mission" not in clean_q and "mission" in clean_faq:
                    pass
                else:
                    is_match = True

            if is_match:
                return {
                    "top_chunks": [{
                        "type": "faq",
                        "title": faq.get("question", ""),
                        "content": faq.get("answer", ""),
                        "category": faq.get("category", "general"),
                        "source": faq.get("source", "SDIT FAQs"),
                        "citation": faq.get("source", "SDIT FAQs"),
                        "score": 1.0
                    }],
                    "best_chunk": {
                        "title": faq.get("question", ""),
                        "content": faq.get("answer", ""),
                        "category": faq.get("category", "general"),
                        "source": faq.get("source", "SDIT FAQs"),
                        "citation": faq.get("source", "SDIT FAQs"),
                        "score": 1.0
                    },
                    "category": faq.get("category", "general"),
                    "sources": [faq.get("source", "SDIT FAQs")],
                    "context_text": faq.get("answer", ""),
                    "score": 1.0
                }

        # 2. Vector search with TF-IDF cosine similarity
        query_vec = self.vectorizer.transform([trimmed_query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        # 3. Combine vector similarity with lexical keyword coverage.
        query_words = set(re.findall(r"\w+", trimmed_query))
        keyword_scores = np.zeros(len(self.all_chunks), dtype=float)
        for idx, chunk in enumerate(self.all_chunks):
            searchable_text = " ".join([
                chunk.get("title", ""),
                chunk.get("content", ""),
                " ".join(chunk.get("keywords", [])),
            ]).lower()
            matched_words = {
                word for word in query_words
                if len(word) > 1 and re.search(rf"(?<![a-z0-9]){re.escape(word)}(?![a-z0-9])", searchable_text)
            }
            keyword_scores[idx] = len(matched_words) / max(len(query_words), 1)
            if trimmed_query in searchable_text:
                keyword_scores[idx] = min(1.0, keyword_scores[idx] + 0.25)

        # Vector similarity handles related phrasing; lexical coverage protects
        # exact codes, years, branch names, and PDF page-specific terminology.
        boosted_scores = (0.65 * similarities) + (0.35 * keyword_scores)

        # 4. Apply keyword bonuses and single-topic disambiguation

        is_mission_only = "mission" in query_words and "vision" not in query_words and "history" not in query_words
        is_vision_only = "vision" in query_words and "mission" not in query_words
        is_history_only = "history" in query_words and "mission" not in query_words and "vision" not in query_words
        is_map_or_location = any(w in query_words for w in ["map", "location", "address", "directions", "where"])
        is_recruiter_query = any(w in query_words for w in [
            "recruit", "recruits", "recruiter", "recruiters", "hiring", "hire",
            "employer", "employers", "company", "companies"
        ])
        is_club_query = any(w in query_words for w in [
            "club", "clubs", "lingua", "nova", "media", "mavericks", "coders",
            "nexus", "sports", "mania", "cult", "mosaic", "finance", "marketing",
            "mantra", "hriday", "samarpan", "eco", "sankalp"
        ])
        is_event_query = any(w in query_words for w in [
            "event", "events", "happenings", "sambhram", "surabhi", "samshodhan",
            "technospark", "graduation", "orientation", "farewell", "alumni", "award"
        ]) or "sports meet" in trimmed_query

        if target_department:
            for idx, chunk in enumerate(self.all_chunks):
                hits = self._chunk_department_hits(chunk)
                if target_department not in hits:
                    if hits:
                        boosted_scores[idx] -= 0.8
                    continue

                boosted_scores[idx] += 2.2
                other_hits = hits - {target_department}
                if other_hits:
                    boosted_scores[idx] -= 0.8 * len(other_hits)

                if self._department_title_matches(chunk, target_department):
                    boosted_scores[idx] += 5.0

        for idx, chunk in enumerate(self.all_chunks):
            chunk_kws = chunk.get("keywords", [])
            overlap = query_words.intersection(chunk_kws)
            if overlap:
                boosted_scores[idx] += 0.08 * len(overlap)

            chunk_title_lower = chunk.get("title", "").lower()

            if is_recruiter_query:
                if chunk.get("category") == "placements":
                    boosted_scores[idx] += 0.35
                if any(term in chunk_title_lower for term in ["recruit", "company", "placement"]):
                    boosted_scores[idx] += 0.25

            if is_club_query:
                if chunk.get("category") == "clubs":
                    boosted_scores[idx] += 0.35
                if "club" in chunk_title_lower or "association" in chunk_title_lower:
                    boosted_scores[idx] += 0.25

            if is_event_query:
                if chunk.get("category") == "events":
                    boosted_scores[idx] += 0.45
                if "event" in chunk_title_lower or "happenings" in chunk_title_lower:
                    boosted_scores[idx] += 0.25

            if is_map_or_location:
                if any(w in chunk_title_lower for w in ["map", "location", "address"]):
                    boosted_scores[idx] += 0.50
                elif any(w in chunk_title_lower for w in ["vision", "mission", "fees"]):
                    boosted_scores[idx] -= 0.35

            elif is_mission_only:
                if "mission" in chunk_title_lower and "vision" not in chunk_title_lower:
                    boosted_scores[idx] += 0.45
                elif "vision" in chunk_title_lower or "history" in chunk_title_lower:
                    boosted_scores[idx] -= 0.35

            elif is_vision_only:
                if "vision" in chunk_title_lower and "mission" not in chunk_title_lower:
                    boosted_scores[idx] += 0.45
                elif "mission" in chunk_title_lower or "history" in chunk_title_lower:
                    boosted_scores[idx] -= 0.35

            elif is_history_only:
                if "history" in chunk_title_lower and "mission" not in chunk_title_lower and "vision" not in chunk_title_lower:
                    boosted_scores[idx] += 0.45
                elif "mission" in chunk_title_lower or "vision" in chunk_title_lower:
                    boosted_scores[idx] -= 0.35

        # Sort indices by score descending
        sorted_indices = np.argsort(boosted_scores)[::-1]
        if target_department:
            department_indices = []
            for idx in sorted_indices:
                chunk = self.all_chunks[int(idx)]
                hits = self._chunk_department_hits(chunk)
                if target_department not in hits:
                    continue

                if not hits or target_department not in hits:
                    continue

                if self._department_title_matches(chunk, target_department):
                    department_indices.append(int(idx))

            if department_indices:
                sorted_indices = np.array(department_indices)

        if is_event_query:
            official_event_indices = [
                idx for idx, chunk in enumerate(self.all_chunks)
                if chunk.get("category") == "events"
                and "official events" in chunk.get("title", "").lower()
            ]
            sorted_indices = np.array(
                official_event_indices
                + [idx for idx in sorted_indices if idx not in official_event_indices]
            )
        top_indices = sorted_indices[:top_k]

        top_chunks = []
        sources = set()
        categories = []

        for idx in top_indices:
            score = float(boosted_scores[idx])
            chunk = self.all_chunks[idx]
            top_chunks.append({
                "type": chunk.get("type"),
                "title": chunk.get("title"),
                "content": chunk.get("content"),
                "category": chunk.get("category"),
                "source": chunk.get("source"),
                "citation": chunk.get("citation", chunk.get("source")),
                "page": chunk.get("page"),
                "url": chunk.get("url"),
                "score": round(score, 4)
            })
            if chunk.get("citation") or chunk.get("source"):
                sources.add(chunk.get("citation", chunk.get("source")))
            if chunk.get("category"):
                categories.append(chunk.get("category"))

        best_chunk = top_chunks[0] if top_chunks else None
        best_score = best_chunk["score"] if best_chunk else 0.0
        if target_department and best_chunk:
            best_score = max(best_score, float(MIN_SIMILARITY_SCORE))
        primary_category = categories[0] if categories else "general"

        # Combine context passages
        context_parts = []
        for c in top_chunks:
            context_parts.append(
                f"### {c['title']}\nSource: {c.get('citation', c.get('source'))}\n{c['content']}"
            )
        context_text = "\n\n".join(context_parts)

        return {
            "top_chunks": top_chunks,
            "best_chunk": best_chunk,
            "category": primary_category,
            "sources": list(sources) if sources else ["SDIT Knowledge Base"],
            "context_text": context_text,
            "score": best_score
        }
