import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface FeedbackSubmission {
  id: string;
  type: "complaint" | "feedback";
  category: string;
  urgency?: "routine" | "medium" | "urgent";
  rating?: number;
  department?: string;
  name?: string;
  email?: string;
  usn?: string;
  isAnonymous: boolean;
  subject: string;
  description: string;
  createdAt: string;
  status: "Received" | "Under Review" | "Action Taken";
}

// Ensure storage directory exists
const DATA_DIR = path.join(process.cwd(), "backend", "data");
const STORAGE_FILE = path.join(DATA_DIR, "feedback_submissions.json");

function readSubmissions(): FeedbackSubmission[] {
  try {
    if (!fs.existsSync(STORAGE_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading feedback submissions:", error);
    return [];
  }
}

function writeSubmissions(submissions: FeedbackSubmission[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(submissions, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing feedback submissions:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      type = "feedback",
      category,
      urgency = "routine",
      rating,
      department,
      name,
      email,
      usn,
      isAnonymous = false,
      subject,
      description,
    } = body;

    if (!subject?.trim() || !description?.trim() || !category) {
      return NextResponse.json(
        { error: "Subject, category, and description are required." },
        { status: 400 }
      );
    }

    const prefix = type === "complaint" ? "SDIT-GRV" : "SDIT-FDB";
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const dateStamp = new Date().getFullYear();
    const ticketId = `${prefix}-${dateStamp}-${randomCode}`;

    const newSubmission: FeedbackSubmission = {
      id: ticketId,
      type: type === "complaint" ? "complaint" : "feedback",
      category,
      urgency: type === "complaint" ? urgency : undefined,
      rating: type === "feedback" && rating ? Number(rating) : undefined,
      department: department || undefined,
      name: isAnonymous ? "Anonymous Student/Visitor" : name?.trim() || "Anonymous",
      email: isAnonymous ? undefined : email?.trim() || undefined,
      usn: isAnonymous ? undefined : usn?.trim()?.toUpperCase() || undefined,
      isAnonymous: Boolean(isAnonymous),
      subject: subject.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      status: "Received",
    };

    const existing = readSubmissions();
    existing.unshift(newSubmission);
    writeSubmissions(existing);

    return NextResponse.json({
      success: true,
      message:
        type === "complaint"
          ? "Grievance registered successfully with the SDIT Redressal Cell."
          : "Thank you for your valuable feedback! It has been recorded.",
      ticket: newSubmission,
    });
  } catch (error) {
    console.error("API Feedback POST error:", error);
    return NextResponse.json(
      { error: "Failed to process submission. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const submissions = readSubmissions();
    return NextResponse.json({
      submissions: submissions.slice(0, 20),
    });
  } catch (error) {
    return NextResponse.json({ submissions: [] });
  }
}
