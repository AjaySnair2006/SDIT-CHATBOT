"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  Building2,
  Briefcase,
  Users,
  FlaskConical,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  MessageSquareHeart,
  Clock,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import Header from "@/components/Header";

/* =========================================================
   5 CAMPUS PHOTOS
========================================================= */

const CAMPUS_IMAGES = [
  "/google-campus-1.jpg",
  "/google-campus-2.jpg",
  "/google-campus-3.jpg",
  "/google-campus-4.jpg",
  "/google-campus-5.jpg",
  "/hero-bg-2.jpg",
  "/hero-bg-3.jpg",
  "/campus-4.jpg",
  "/campus-5.jpg",
];

/* =========================================================
   CHAT TOPICS
========================================================= */

const CATEGORIES = [
  {
    label: "Admissions",
    icon: GraduationCap,
    desc: "Eligibility, entrance exams, important dates, and how to apply.",
    topic: "Admissions",
  },
  {
    label: "Courses",
    icon: BookOpen,
    desc: "Explore undergraduate and postgraduate programmes.",
    topic: "Courses",
  },
  {
    label: "Campus",
    icon: Building2,
    desc: "Learn about labs, library, hostel, transport, and facilities.",
    topic: "Campus",
  },
  {
    label: "Placements",
    icon: Briefcase,
    desc: "Training, recruiters, internships, and career opportunities.",
    topic: "Placements",
  },
  {
    label: "Clubs & Activities",
    icon: Users,
    desc: "Discover technical, cultural, sports, and student clubs.",
    topic: "Clubs",
  },
  {
    label: "Research",
    icon: FlaskConical,
    desc: "Explore research areas, projects, innovation, and publications.",
    topic: "Research",
  },
];

/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage() {
  const [activeImage, setActiveImage] = useState(0);
  const router = useRouter();

  /* =======================================================
     AUTO SLIDER
  ======================================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImage((current) =>
        current === CAMPUS_IMAGES.length - 1 ? 0 : current + 1
      );
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  /* =======================================================
     NEXT IMAGE
  ======================================================= */

  const nextImage = () => {
    setActiveImage((current) =>
      current === CAMPUS_IMAGES.length - 1 ? 0 : current + 1
    );
  };

  /* =======================================================
     PREVIOUS IMAGE
  ======================================================= */

  const previousImage = () => {
    setActiveImage((current) =>
      current === 0 ? CAMPUS_IMAGES.length - 1 : current - 1
    );
  };

  return (
    <AppShell
      renderHeader={(openMenu) => (
        <Header onMenuClick={openMenu} />
      )}
    >
      <div className="mx-auto max-w-[1450px] px-4 pb-6 pt-2 sm:px-6 lg:px-8">

        {/* =====================================================
            HERO SECTION
        ====================================================== */}

        <section className="overflow-hidden rounded-[28px] border border-[#e1e6df] bg-white shadow-[0_10px_40px_rgba(23,56,43,0.06)]">

          <div className="grid min-h-[500px] grid-cols-1 lg:grid-cols-[0.9fr_1.3fr]">

            {/* =================================================
                LEFT HERO CONTENT
            ================================================== */}

            <div className="flex flex-col justify-center px-7 py-8 sm:px-10 lg:px-12">

              {/* Status */}

              <div className="flex items-center gap-2">

                <span className="relative flex h-2.5 w-2.5">

                  <span className="absolute h-full w-full animate-ping rounded-full bg-[#2cad68] opacity-40" />

                  <span className="relative h-2.5 w-2.5 rounded-full bg-[#2cad68]" />

                </span>

                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#258355]">
                  SDIT Campus Intelligence
                </span>

              </div>


              {/* Heading */}

              <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.03] tracking-tight text-[#17382b] sm:text-6xl lg:text-[60px]">

                Your Campus.

                <br />

                <span className="text-[#27885a]">
                  Intelligence.
                </span>

                <br />

                <span className="text-[#8b5e3c]">
                  Connected.
                </span>

              </h1>


              {/* Description */}

              <p className="mt-5 max-w-xl text-base leading-6 text-[#6f7973] sm:text-lg">
                One intelligent space to explore SDIT, discover
                opportunities, and get answers about your campus
                whenever you need them.
              </p>


              {/* Buttons */}

              <div className="mt-6 flex flex-wrap gap-3">

                <Link
                  href="/chat"
                  onMouseEnter={() => router.prefetch("/chat")}
                  onFocus={() => router.prefetch("/chat")}
                  className="group inline-flex items-center gap-3 rounded-xl bg-[#173c2d] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#20543f]"
                >
                  Start Chatting

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </Link>


                <Link
                  href="https://www.google.com/maps/search/?api=1&query=Shree+Devi+Institute+of+Technology+Kenjar+Mangaluru+Karnataka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#dfe4de] bg-white px-5 py-3.5 text-sm font-medium text-[#46534c] transition hover:border-[#d9b24c] hover:bg-[#fffaf0]"
                >
                  Explore Campus
                </Link>

              </div>


              {/* Stats */}

              <div className="mt-8 grid max-w-lg grid-cols-3 border-t border-[#e8ebe6] pt-5">

                <div>

                  <p className="text-2xl font-semibold text-[#17382b]">
                    24+
                  </p>

                  <p className="mt-1 text-xs text-[#929b95]">
                    Knowledge Areas
                  </p>

                </div>


                <div className="border-l border-[#e8ebe6] pl-5">

                  <p className="text-2xl font-semibold text-[#17382b]">
                    24/7
                  </p>

                  <p className="mt-1 text-xs text-[#929b95]">
                    AI Assistance
                  </p>

                </div>


                <div className="border-l border-[#e8ebe6] pl-5">

                  <p className="text-2xl font-semibold text-[#17382b]">
                    AI
                  </p>

                  <p className="mt-1 text-xs text-[#929b95]">
                    Campus Powered
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                RIGHT — 5 PHOTO CAMPUS SLIDER
            ================================================== */}

            <div className="relative min-h-[420px] overflow-hidden bg-[#e8ece7] lg:min-h-[500px]">

              {/* =================================================
                  MAIN 5 IMAGE SLIDER
              ================================================== */}

              {CAMPUS_IMAGES.map((image, index) => (

                <img
                  key={image}
                  src={image}
                  alt={`SDIT campus view ${index + 1}`}
                  className={`
                    absolute inset-0 h-full w-full object-cover
                    transition-all duration-700
                    ${
                      index === activeImage
                        ? "scale-100 opacity-100"
                        : "scale-[1.04] opacity-0"
                    }
                  `}
                />

              ))}


              {/* Image overlay */}

              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />

              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />


              {/* =================================================
                  PHOTO INFORMATION
              ================================================== */}

              <div className="absolute bottom-7 left-7 z-10 max-w-[70%] sm:left-9">

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                  Explore SDIT
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  Shree Devi Institute of Technology
                </h2>

                <p className="mt-1 text-sm text-white/70">
                  Innovation • Excellence • Student Life
                </p>

              </div>


              {/* =================================================
                  5 VERTICAL THUMBNAILS
              ================================================== */}

              <div className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 sm:flex">

                {CAMPUS_IMAGES.map((image, index) => (

                  <button
                    key={image}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View campus photo ${index + 1}`}
                    className={`
                      h-[68px] w-[82px]
                      overflow-hidden rounded-xl
                      border-2
                      shadow-md
                      transition-all duration-300
                      ${
                        activeImage === index
                          ? "scale-105 border-[#d9b24c]"
                          : "border-white/70 opacity-75 hover:scale-105 hover:opacity-100"
                      }
                    `}
                  >

                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                    />

                  </button>

                ))}

              </div>


              {/* =================================================
                  PREVIOUS / NEXT BUTTONS
              ================================================== */}

              <div className="absolute right-5 top-5 z-20 flex gap-2">

                <button
                  onClick={previousImage}
                  aria-label="Previous campus photo"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40"
                >
                  <ChevronLeft size={18} />
                </button>


                <button
                  onClick={nextImage}
                  aria-label="Next campus photo"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40"
                >
                  <ChevronRight size={18} />
                </button>

              </div>


              {/* =================================================
                  PHOTO COUNTER
              ================================================== */}

              <div className="absolute bottom-7 right-5 z-20 rounded-full bg-black/25 px-3 py-1.5 font-mono text-xs text-white backdrop-blur-md sm:right-[115px]">

                {String(activeImage + 1).padStart(2, "0")}
                {" / "}
                {String(CAMPUS_IMAGES.length).padStart(2, "0")}

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            SMART ASSISTANCE
        ====================================================== */}

        <section className="mt-14">

          <div className="flex items-end justify-between">

            <div>

              <div className="flex items-center gap-2 text-[#258355]">

                <Sparkles size={17} />

                <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                  Smart Assistance
                </span>

              </div>


              <h2 className="mt-2 text-2xl font-semibold text-[#17382b] sm:text-3xl">
                How can I help you today?
              </h2>

            </div>


            <Link
              href="/chat"
              className="hidden items-center gap-1 text-sm font-medium text-[#258355] sm:flex"
            >
              Ask SmartBot
              <ArrowRight size={15} />
            </Link>

          </div>


          {/* =================================================
              CATEGORY CARDS
          ================================================== */}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {CATEGORIES.map((category) => {

              const Icon = category.icon;

              return (

                <Link
                  key={category.label}
                  href={`/chat?topic=${encodeURIComponent(category.topic)}`}
                  className="group rounded-2xl border border-[#e1e6df] bg-white p-5 shadow-[0_5px_20px_rgba(23,56,43,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9b24c]/70 hover:shadow-[0_12px_30px_rgba(23,56,43,0.08)]"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff8f2] text-[#258355]">
                      <Icon size={21} />
                    </div>


                    <ArrowRight
                      size={17}
                      className="text-[#b8c0bb] transition-all group-hover:translate-x-1 group-hover:text-[#c3942d]"
                    />

                  </div>


                  <h3 className="mt-5 text-base font-semibold text-[#17382b]">
                    {category.label}
                  </h3>


                  <p className="mt-2 text-sm leading-6 text-[#8a948e]">
                    {category.desc}
                  </p>

                </Link>

              );

            })}

          </div>

        </section>


        {/* =====================================================
            GRIEVANCE & FEEDBACK SECTION
        ====================================================== */}

        <section className="mt-14 overflow-hidden rounded-[26px] border border-[#e1e6df] bg-gradient-to-br from-white via-white to-[#fbfcfb] p-6 shadow-[0_6px_30px_rgba(23,56,43,0.04)] sm:p-8">

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

            <div>

              <div className="flex items-center gap-2 text-[#258355]">
                <ShieldAlert size={17} />
                <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                  Student Services &amp; Quality
                </span>
              </div>

              <h2 className="mt-2 text-2xl font-bold text-[#17382b] sm:text-3xl">
                Grievance Redressal &amp; Campus Feedback
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#728078]">
                SDIT maintains an active Grievance Redressal Cell and Anti-Ragging Committee to ensure a safe, supportive, and world-class academic environment.
              </p>

            </div>

            <Link
              href="/feedback"
              className="inline-flex items-center gap-1.5 self-start md:self-auto rounded-xl bg-[#17382b] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#215440]"
            >
              <span>Open Portal</span>
              <ArrowRight size={14} />
            </Link>

          </div>


          {/* 2 Feature Cards */}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Card 1: File a Grievance */}

            <Link
              href="/feedback"
              className="group rounded-2xl border border-[#e5ebe4] bg-[#f9faf8] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d9b24c] hover:bg-white hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff2ef] text-[#c93e23]">
                  <ShieldAlert size={20} />
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#c93e23]">
                  <Clock size={13} />
                  <span>48–72h Resolution</span>
                </div>

              </div>

              <h3 className="mt-4 text-base font-bold text-[#17382b]">
                Lodge a Complaint / Grievance
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-[#6c7b73]">
                Report issues regarding academics, labs, mess/hostels, transport, fees, or discipline. 100% anonymous submission supported.
              </p>

              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#17382b] group-hover:text-[#258355]">
                <span>Submit a Grievance</span>
                <ArrowRight size={13} className="transition group-hover:translate-x-1" />
              </div>

            </Link>


            {/* Card 2: Campus Feedback */}

            <Link
              href="/feedback"
              className="group rounded-2xl border border-[#e5ebe4] bg-[#f9faf8] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d9b24c] hover:bg-white hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff8f2] text-[#258355]">
                  <MessageSquareHeart size={20} />
                </div>

                <span className="rounded-full bg-[#f2f6f3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#258355]">
                  Constructive Ideas
                </span>

              </div>

              <h3 className="mt-4 text-base font-bold text-[#17382b]">
                Share Suggestions &amp; Feedback
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-[#6c7b73]">
                Rate your SDIT experience, suggest campus improvements, and share ideas for facilities, events, clubs, or the AI chatbot.
              </p>

              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#17382b] group-hover:text-[#258355]">
                <span>Give Feedback</span>
                <ArrowRight size={13} className="transition group-hover:translate-x-1" />
              </div>

            </Link>

          </div>

        </section>


        {/* =====================================================
            KNOWLEDGE BASE NOTICE
        ====================================================== */}

        <section className="mt-8 rounded-2xl border border-[#e1e6df] bg-white p-5">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eff8f2] text-[#258355]">
              <ShieldCheck size={22} />
            </div>


            <div>

              <p className="text-sm font-semibold text-[#17382b]">
                SDIT SmartBot Knowledge Base
              </p>

              <p className="mt-1 text-xs leading-5 text-[#929b95]">
                SmartBot answers using information from SDIT&apos;s
                knowledge base. For official or time-sensitive details,
                please confirm with the college administration.
              </p>

            </div>

          </div>

        </section>

      </div>
    </AppShell>
  );
}