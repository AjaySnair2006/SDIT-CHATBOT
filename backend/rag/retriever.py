import json
import re
from pathlib import Path
from typing import Any, Optional

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from config import DATA_DIR, DOCS_DIR, FAQ_FILE, KNOWLEDGE_FILE, TOP_K_DOCUMENTS, MIN_SIMILARITY_SCORE


class KnowledgeRetriever:
    """
    RAG Retriever for SDIT Knowledge Base.
    Indexes structured JSON knowledge items, FAQ pairs, and markdown documentation.
    Uses TF-IDF + n-gram representation with cosine similarity and keyword boosting.
    """

    def __init__(self):
        self.knowledge_items: list[dict[str, Any]] = []
        self.faq_items: list[dict[str, Any]] = []
        self.doc_passages: list[dict[str, Any]] = []
        self.all_chunks: list[dict[str, Any]] = []

        self.vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix = None

        self.load_and_index()

    def load_and_index(self):
        """Loads all datasets and builds the TF-IDF search index."""
        self.knowledge_items = []
        self.faq_items = []
        self.doc_passages = []
        self.all_chunks = []

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
                except Exception as e:
                    print(f"[Warning] Failed to read {doc_path}: {e}")

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
                "search_text": search_text,
                "question": faq.get("question", "").lower(),
                "keywords": [w.lower() for w in re.findall(r"\w+", faq.get("question", ""))]
            })

        # From document passages:
        for passage in self.doc_passages:
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
            print(f"[RAG] Successfully indexed {len(self.all_chunks)} knowledge chunks from SDIT dataset.")
        else:
            print("[RAG] Warning: No dataset documents found to index.")

    def _parse_markdown_into_passages(self, filename: str, content: str):
        """Splits markdown file into sections by headings."""
        sections = re.split(r"\n(?=##?\s)", content)
        for i, sec in enumerate(sections):
            sec_trimmed = sec.strip()
            if not sec_trimmed:
                continue
            lines = sec_trimmed.split("\n")
            title = lines[0].replace("#", "").strip() if lines else filename
            body = "\n".join(lines[1:]).strip() if len(lines) > 1 else sec_trimmed
            
            # Simple category inference from filename
            cat = "general"
            lower_name = filename.lower()
            if "admission" in lower_name:
                cat = "admissions"
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
                        "score": 1.0
                    }],
                    "best_chunk": {
                        "title": faq.get("question", ""),
                        "content": faq.get("answer", ""),
                        "category": faq.get("category", "general"),
                        "source": faq.get("source", "SDIT FAQs"),
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

        # 3. Apply keyword bonuses and single-topic disambiguation
        query_words = set(re.findall(r"\w+", trimmed_query))
        boosted_scores = np.copy(similarities)

        is_mission_only = "mission" in query_words and "vision" not in query_words and "history" not in query_words
        is_vision_only = "vision" in query_words and "mission" not in query_words
        is_history_only = "history" in query_words and "mission" not in query_words and "vision" not in query_words
        is_map_or_location = any(w in query_words for w in ["map", "location", "address", "directions", "where"])

        for idx, chunk in enumerate(self.all_chunks):
            chunk_kws = chunk.get("keywords", [])
            overlap = query_words.intersection(chunk_kws)
            if overlap:
                boosted_scores[idx] += 0.08 * len(overlap)

            chunk_title_lower = chunk.get("title", "").lower()

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
                "score": round(score, 4)
            })
            if chunk.get("source"):
                sources.add(chunk.get("source"))
            if chunk.get("category"):
                categories.append(chunk.get("category"))

        best_chunk = top_chunks[0] if top_chunks else None
        best_score = best_chunk["score"] if best_chunk else 0.0
        primary_category = categories[0] if categories else "general"

        # Combine context passages
        context_parts = []
        for c in top_chunks:
            context_parts.append(f"### {c['title']}\n{c['content']}")
        context_text = "\n\n".join(context_parts)

        return {
            "top_chunks": top_chunks,
            "best_chunk": best_chunk,
            "category": primary_category,
            "sources": list(sources) if sources else ["SDIT Knowledge Base"],
            "context_text": context_text,
            "score": best_score
        }
