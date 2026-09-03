"use client";

import { useState } from "react";
import {
  MessageSquareWarning,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ComplaintsPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5] px-5 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#d9b24c]/40 bg-[#fffaf0]">
            <MessageSquareWarning
              size={23}
              className="text-[#bd8f2b]"
            />
          </div>

          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#bd8f2b]">
            Student Support
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#17382b]">
            Complaints
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718079]">
            Have an issue you would like the college to know about?
            Submit your complaint below and provide the necessary details.
          </p>
        </div>

        {/* Success */}
        {submitted ? (
          <div className="rounded-2xl border border-[#bfe3cd] bg-white p-8 shadow-[0_10px_35px_rgba(23,56,43,0.06)]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#edf8f1]">
                <CheckCircle2 size={32} className="text-[#258355]" />
              </div>

              <h2 className="text-xl font-bold text-[#17382b]">
                Complaint Submitted
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#718079]">
                Thank you for reporting the issue. Your complaint has been
                recorded successfully.
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-xl bg-[#17382b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24523f]"
              >
                Submit Another Complaint
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#e1e6df] bg-white p-6 shadow-[0_10px_35px_rgba(23,56,43,0.06)] lg:p-8"
          >
            {/* Notice */}
            <div className="mb-7 flex gap-3 rounded-xl border border-[#f0dfad] bg-[#fffaf0] p-4">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-[#bd8f2b]"
              />

              <p className="text-xs leading-5 text-[#6d6857]">
                Please provide accurate information so the issue can be
                reviewed properly.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#46544d]">
                  Your Name
                </label>

                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[#dfe5df] bg-[#fafbf9] px-4 py-3 text-sm text-[#17382b] outline-none transition placeholder:text-[#a3aca7] focus:border-[#c3942d] focus:bg-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#46544d]">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-[#dfe5df] bg-[#fafbf9] px-4 py-3 text-sm text-[#17382b] outline-none transition placeholder:text-[#a3aca7] focus:border-[#c3942d] focus:bg-white"
                />
              </div>
            </div>

            {/* Category */}
            <div className="mt-6">
              <label className="mb-2 block text-xs font-semibold text-[#46544d]">
                Complaint Category
              </label>

              <select
                required
                className="w-full rounded-xl border border-[#dfe5df] bg-[#fafbf9] px-4 py-3 text-sm text-[#46544d] outline-none transition focus:border-[#c3942d] focus:bg-white"
              >
                <option value="">Select a category</option>
                <option>Academic</option>
                <option>Campus Facilities</option>
                <option>Hostel</option>
                <option>Library</option>
                <option>Transport</option>
                <option>Technical Issue</option>
                <option>Other</option>
              </select>
            </div>

            {/* Subject */}
            <div className="mt-6">
              <label className="mb-2 block text-xs font-semibold text-[#46544d]">
                Subject
              </label>

              <input
                type="text"
                required
                placeholder="Briefly describe the issue"
                className="w-full rounded-xl border border-[#dfe5df] bg-[#fafbf9] px-4 py-3 text-sm text-[#17382b] outline-none transition placeholder:text-[#a3aca7] focus:border-[#c3942d] focus:bg-white"
              />
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="mb-2 block text-xs font-semibold text-[#46544d]">
                Complaint Details
              </label>

              <textarea
                required
                rows={6}
                placeholder="Explain the issue in detail..."
                className="w-full resize-none rounded-xl border border-[#dfe5df] bg-[#fafbf9] px-4 py-3 text-sm text-[#17382b] outline-none transition placeholder:text-[#a3aca7] focus:border-[#c3942d] focus:bg-white"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17382b] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#24523f] sm:w-auto"
            >
              <Send size={16} />
              Submit Complaint
            </button>
          </form>
        )}
      </div>
    </div>
  );
}