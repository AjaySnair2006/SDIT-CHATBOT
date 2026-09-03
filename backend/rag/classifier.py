import re
from typing import Optional

CATEGORY_KEYWORDS = {
    "admissions": [
        "admission", "admissions", "apply", "eligibility", "eligible", "cutoff",
        "marks", "puc", "10+2", "12th", "kcet", "comedk", "quota", "management quota",
        "pgcet", "kmat", "gate", "document", "documents", "fee", "fees", "scholarship", "scholarships",
        "seat", "seats", "counseling", "lateral entry", "diploma", "code", "cet code", "ssp", "nsp",
        "e146", "b281", "c476", "t868"
    ],
    "courses": [
        "course", "courses", "branch", "branches", "programme", "program", "programs",
        "b.e", "be", "btech", "mtech", "mba", "mca", "cse", "computer science",
        "aiml", "artificial intelligence", "data science", "ise", "information science",
        "ece", "electronics", "aeronautical", "aerospace", "civil", "mechanical",
        "syllabus", "curriculum", "specialization", "specializations", "faculty", "hod",
        "principal", "vice principal", "manujesh", "nethravathi", "anand uppar", "chitra prabhu",
        "sudheer kumar", "professors"
    ],
    "placements": [
        "placement", "placements", "recruit", "recruiter", "recruiters", "company",
        "companies", "hiring", "hire", "employer", "employers", "job company",
        "recruiting company", "recruiting companies", "company recruiters", "package", "salary", "lpa", "highest package", "average package",
        "training", "aptitude", "internship", "internships", "jobs", "job", "career",
        "t&p", "drive", "drives", "placed", "amazon", "infosys", "tcs", "wipro", "dxc", "icici"
    ],
    "facilities": [
        "facility", "facilities", "hostel", "hostels", "mess", "food", "dining",
        "room", "rooms", "stay", "accommodation", "bus", "transport", "transportation",
        "route", "routes", "schedule", "library", "digital library", "books", "delnet", "ndli",
        "lab", "labs", "laboratory", "wifi", "wi-fi", "internet", "canteen", "cafeteria", "menu",
        "gym", "gymnasium", "sports", "ground", "cricket", "seminar hall", "auditorium",
        "medical", "health", "doctor", "ambulance", "curfew"
    ],
    "campus": [
        "campus", "infrastructure", "location", "address", "where is", "reach",
        "kenjar", "airport road", "environment", "area", "map", "maps", "google map",
        "google maps", "location map", "college map", "campus location", "layout"
    ],
    "clubs": [
        "club", "clubs", "activity", "activities", "extracurricular", "fest",
        "cultural", "sambram", "dance", "music", "robotics", "coding club", "aero club",
        "nss", "red cross", "event", "events", "hackathon", "student society", "ieee", "csi", "iste",
        "lingua nova", "media mavericks", "coders nexus", "sports mania", "cult-mosaic",
        "finance club", "marketing club", "mantra", "hriday", "samarpan", "eco club", "sankalp"
    ],
    "research": [
        "research", "innovation", "incubation", "patent", "patents", "phd",
        "publication", "publications", "projects", "startup", "startups", "center"
    ],
    "general": [
        "about", "sdit", "shree devi", "who are you", "trust", "sadananda shetty",
        "nidhish", "affiliation", "vtu", "aicte", "contact", "email", "phone", "helpdesk",
        "leave", "attendance", "hall ticket", "grievance", "complaint", "anti ragging",
        "ragging", "results", "academic calendar", "calendar of events", "exam timetable", "induction"
    ]
}

def classify_intent(query: str) -> str:
    """
    Classifies user question into one of the known categories:
    admissions, courses, placements, facilities, campus, clubs, research, general.
    """
    cleaned = re.sub(r"[^\w\s]", " ", query.lower())
    words = set(cleaned.split())

    scores: dict[str, int] = {cat: 0 for cat in CATEGORY_KEYWORDS}

    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if " " in kw:
                if kw in cleaned:
                    scores[cat] += 3
            else:
                if kw in words:
                    scores[cat] += 2

    # Find category with highest score
    best_category = max(scores, key=scores.get)
    if scores[best_category] > 0:
        return best_category

    return "general"
