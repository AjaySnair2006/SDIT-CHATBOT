import unittest
from fastapi.testclient import TestClient
from main import app

class TestSDITSmartBotBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client_cm = TestClient(app)
        cls.client = cls.client_cm.__enter__()

    @classmethod
    def tearDownClass(cls):
        cls.client_cm.__exit__(None, None, None)

    def test_health_check(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "ok")
        self.assertEqual(data.get("kcet_code"), "E146")
        self.assertEqual(data.get("pgcet_codes", {}).get("mba"), "B281")
        self.assertGreater(data.get("indexed_chunks", 0), 0)
        print(f"\n[PASS] Health check verified (KCET Code: {data.get('kcet_code')}, Chunks: {data.get('indexed_chunks')})")

    def test_categories(self):
        response = self.client.get("/categories")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("categories", data)
        self.assertEqual(len(data["categories"]), 7)
        print(f"[PASS] Categories: {len(data['categories'])} verified")

    def test_query_courses(self):
        response = self.client.post("/ask", json={"question": "What courses are available at SDIT?"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("answer", data)
        self.assertIn("Computer Science", data["answer"])
        self.assertEqual(data.get("category"), "courses")
        print(f"[PASS] Courses query: Category='{data.get('category')}'")

    def test_query_admissions_kcet_code(self):
        response = self.client.post("/ask", json={"question": "What is the KCET code of SDIT?"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("E146", data["answer"])
        self.assertEqual(data.get("category"), "admissions")
        print(f"[PASS] KCET Code query: Answer contained 'E146'")

    def test_query_principal_leadership(self):
        response = self.client.post("/ask", json={"question": "Who is the Principal of SDIT?"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("Manujesh", data["answer"])
        print(f"[PASS] Principal Leadership query: Answer contained 'Dr. Manujesh B. J.'")

    def test_query_student_leave(self):
        response = self.client.post("/ask", json={"question": "How can I apply for leave as a student?"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("HOD", data["answer"])
        print(f"[PASS] Student Leave query: Answer contained HOD leave procedure")

    def test_query_grievance(self):
        response = self.client.post("/ask", json={"question": "How do I register a complaint or grievance?"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("grievance", data["answer"].lower())
        print(f"[PASS] Grievance query answered with official resolution process")

    def test_query_cultural_fest_sambram(self):
        response = self.client.post("/ask", json={"question": "Tell me about the annual cultural fest Sambram"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("Sambram", data["answer"])
        print(f"[PASS] Fest query: Answer contained 'Sambram'")

    def test_query_mission_alone(self):
        response = self.client.post("/ask", json={"question": "mission"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("Mission", data["answer"])
        self.assertNotIn("Vision of Shree Devi Institute", data["answer"])
        self.assertNotIn("History & Background", data["answer"])
        print(f"[PASS] Mission alone query: returned ONLY mission")

    def test_query_vision_alone(self):
        response = self.client.post("/ask", json={"question": "vision"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("Vision", data["answer"])
        self.assertNotIn("Mission of Shree Devi Institute", data["answer"])
        self.assertNotIn("History & Background", data["answer"])
        print(f"[PASS] Vision alone query: returned ONLY vision")

    def test_query_history_alone(self):
        response = self.client.post("/ask", json={"question": "history"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("History & Background", data["answer"])
        self.assertNotIn("Mission of Shree Devi Institute", data["answer"])
        self.assertNotIn("Vision of Shree Devi Institute", data["answer"])
        print(f"[PASS] History alone query: returned ONLY history")

    def test_query_vision_and_mission(self):
        response = self.client.post("/ask", json={"question": "What is the vision and mission of SDIT?"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("Vision", data["answer"])
        self.assertIn("Mission", data["answer"])
        print(f"[PASS] Vision and Mission query: returned both together")

    def test_query_address_includes_google_map(self):
        response = self.client.post("/ask", json={"question": "What is the address of the college?"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("Airport Road, Kenjar", data["answer"])
        self.assertIn("[map:https://maps.google.com/maps", data["answer"])
        self.assertIn("Open in Google Maps", data["answer"])
        print(f"[PASS] Address query returned Google Maps embed tag and directions link")

    def test_query_map_request_includes_google_map(self):
        response = self.client.post("/ask", json={"question": "Show me the map of SDIT"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("[map:https://maps.google.com/maps", data["answer"])
        self.assertIn("Open in Google Maps", data["answer"])
        print(f"[PASS] Map query returned Google Maps embed tag and directions link")

    def test_multilingual_kannada(self):
        response = self.client.post("/ask", json={"question": "ನಮಸ್ಕಾರ"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("ನಮಸ್ಕಾರ", data["answer"])
        print(f"[PASS] Multilingual Kannada greeting handled")

    def test_multilingual_malayalam(self):
        response = self.client.post("/ask", json={"question": "നമസ്കാരം"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("നമസ്കാരം", data["answer"])
        print(f"[PASS] Multilingual Malayalam greeting handled")

    def test_multilingual_hindi(self):
        response = self.client.post("/ask", json={"question": "नमस्ते"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("नमस्ते", data["answer"])
        print(f"[PASS] Multilingual Hindi greeting handled")

    def test_persona_student(self):
        response = self.client.post("/ask", json={
            "question": "Hello",
            "user_type": "student",
            "language": "en"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("SDIT student", data["answer"])
        print(f"[PASS] Student persona greeting handled")

    def test_reload_endpoint(self):
        response = self.client.post("/reload")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "success")
        print(f"[PASS] Hot reload verified: {data.get('message')}")

    def test_empty_question(self):
        response = self.client.post("/ask", json={"question": "   "})
        self.assertEqual(response.status_code, 400)
        print(f"[PASS] Bad request validation: HTTP 400")

if __name__ == "__main__":
    unittest.main()
