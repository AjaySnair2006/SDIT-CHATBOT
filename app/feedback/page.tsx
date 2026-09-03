"use client";

import { useState } from "react";
import {
  Star,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
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
            <Star size={23} className="text-[#bd8f2b]" />
          </div>

          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#bd8f2b]">
            Your Opinion Matters
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#17382b]">
            Feedback
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718079]">
            Help us improve SDIT SmartBot and your campus experience.
            Share your thoughts with us.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-[#bfe3cd] bg-white p-8 shadow-[0_10px_35px_rgba(23,56,43,0.06)]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#edf8f1]">
                <CheckCircle2 size={32} className="text-[#258355]" />
              </div>

              <h2 className="text-xl font-bold text-[#17382b]">
                Thank You!
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#718079]">
                Your feedback has been submitted successfully. Your opinion
                helps us make SDIT SmartBot better.
              </p>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setRating(0);
                }}
                className="mt-6 rounded-xl bg-[#17382b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24523f]"
              >
                Give More Feedback
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#e1e6df] bg-white p-6 shadow-[0_10px_35px_rgba(23,56,43,0.06)] lg:p-8"
          >
            {/* Rating */}
            <div className="border-b border-[#edf0eb] pb-7">
              <p className="text-sm font-semibold text-[#17382b]">
                How would you rate your experience?
              </p>

              <div className="mt-4 flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-label={`Rate ${value} out of 5`}
                    className="rounded-lg p-1 transition hover:bg-[#fffaf0]"
                  >
                    <Star
                      size={30}
                      className={
                        value <= rating
                          ? "fill-[#d1a53c] text-[#d1a53c]"
                          : "text-[#cbd2cd]"
                      }
                    />
                  </button>
                ))}
              </div>

              <p className="mt-2 text-xs text-[#98a19c]">
                {rating === 0
                  ? "Select a rating"
                  : `${rating} out of 5 selected`}
              </p>
            </div>

            {/* Name & Email */}
            <div className="mt-7 grid gap-6 md:grid-cols-2">
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

            {/* Feedback Type */}
            <div className="mt-6">
              <label className="mb-2 block text-xs font-semibold text-[#46544d]">
                Feedback Type
              </label>

              <select
                required
                className="w-full rounded-xl border border-[#dfe5df] bg-[#fafbf9] px-4 py-3 text-sm text-[#46544d] outline-none transition focus:border-[#c3942d] focus:bg-white"
              >
                <option value="">Select feedback type</option>
                <option>SDIT SmartBot</option>
                <option>Campus Experience</option>
                <option>Website</option>
                <option>Suggestion</option>
                <option>Other</option>
              </select>
            </div>

            {/* Message */}
            <div className="mt-6">
              <label className="mb-2 block text-xs font-semibold text-[#46544d]">
                Your Feedback
              </label>

              <textarea
                required
                rows={6}
                placeholder="Tell us what you think..."
                className="w-full resize-none rounded-xl border border-[#dfe5df] bg-[#fafbf9] px-4 py-3 text-sm text-[#17382b] outline-none transition placeholder:text-[#a3aca7] focus:border-[#c3942d] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={rating === 0}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17382b] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#24523f] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Send size={16} />
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}