"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  MessageCircle,
  MapPin,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Users,
  Building2,
  X,
  ChevronRight,
  MessageSquareWarning,
  Star,
  CircleHelp,
} from "lucide-react";
import {
  isLanguageCode,
  LANGUAGE_STORAGE_KEY,
  subscribeToLanguageChange,
  translate,
  type LanguageCode,
} from "@/lib/language";

interface AppShellProps {
  children: React.ReactNode;
  renderHeader?: (openMenu: () => void) => React.ReactNode;
}

const NAVIGATION = [
  {
    title: "AI COMMAND",
    items: [
      {
        label: "Start Chat",
        description: "Ask SDIT SmartBot",
        href: "/chat",
        icon: MessageCircle,
      },
    ],
  },

  {
    title: "CAMPUS",
    items: [
      {
        label: "Explore Campus",
        description: "Discover SDIT",
        href: "https://www.google.com/maps/search/?api=1&query=Shree+Devi+Institute+of+Technology+Kenjar+Mangaluru+Karnataka",
        icon: MapPin,
      },
      {
        label: "Campus Facilities",
        description: "Labs, library & more",
        href: "/chat?topic=Campus",
        icon: Building2,
      },
    ],
  },

  {
    title: "INFORMATION",
    items: [
      {
        label: "Admissions",
        description: "Eligibility & process",
        href: "/chat?topic=Admissions",
        icon: GraduationCap,
      },
      {
        label: "Courses",
        description: "Programs & departments",
        href: "/chat?topic=Courses",
        icon: Building2,
      },
      {
        label: "Placements",
        description: "Training & careers",
        href: "/chat?topic=Placements",
        icon: Briefcase,
      },
      {
        label: "Clubs & Activities",
        description: "Student life",
        href: "/chat?topic=Clubs",
        icon: Users,
      },
      {
        label: "Research",
        description: "Innovation & projects",
        href: "/chat?topic=Research",
        icon: FlaskConical,
      },
    ],
  },

  {
    title: "SUPPORT",
    items: [
      {
        label: "Complaints",
        description: "Report an issue",
        href: "/complaints",
        icon: MessageSquareWarning,
      },
      {
        label: "Feedback",
        description: "Share your experience",
        href: "/feedback",
        icon: Star,
      },
      {
        label: "Help & Support",
        description: "Get assistance",
        href: "/help",
        icon: CircleHelp,
      },
    ],
  },
];

export default function AppShell({
  children,
  renderHeader,
}: AppShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoPreviewOpen, setLogoPreviewOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguageCode(stored)) setLanguage(stored);
    return subscribeToLanguageChange(setLanguage);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#17382b]">

      {/* ============================================
          MOBILE OVERLAY
      ============================================= */}

      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
        />
      )}


      {/* ============================================
          FLOATING SIDEBAR
      ============================================= */}

      <aside
        className={`
          fixed left-4 top-4 bottom-4 z-50
          flex w-[260px] flex-col
          overflow-hidden rounded-[26px]
          border border-[#e1e6df]
          bg-white
          shadow-[0_12px_45px_rgba(23,56,43,0.08)]
          transition-transform duration-300

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-[120%] lg:translate-x-0"
          }
        `}
      >

        {/* ==========================================
            BRAND
        =========================================== */}

        <div className="border-b border-[#edf0eb] px-5 pb-5 pt-6">

          <div className="flex items-center justify-between">

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3"
            >

              {/* Logo */}

              <div
                role="button"
                tabIndex={0}
                aria-label="View SDIT logo"
                onClick={(event) => {
                  event.preventDefault();
                  setLogoPreviewOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setLogoPreviewOpen(true);
                  }
                }}
                className="relative flex h-14 w-14 shrink-0 cursor-zoom-in items-center justify-center rounded-xl border border-[#efb8c5]/60 bg-[#fff1f4]"
              >

                <img
                  src="/sdit-logo.jpg"
                  alt="Shree Devi Institute of Technology logo"
                  className="h-full w-full rounded-xl object-contain"
                />

                {/* Online indicator */}

                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#2cad68]" />

              </div>


              {/* Brand text */}

              <div>

                <p className="text-[17px] font-bold tracking-wide text-[#17382b]">
                  SDIT AI
                </p>

                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-[#8b9690]">
                  Smart Campus
                </p>

              </div>

            </Link>


            {/* Mobile close button */}

            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="rounded-lg p-2 text-[#7e8983] transition hover:bg-[#f5f7f4] lg:hidden"
            >
              <X size={18} />
            </button>

          </div>


          {/* ========================================
              SYSTEM STATUS
          ========================================= */}

          <div className="mt-5 flex items-center justify-between rounded-xl border border-[#e8ece7] bg-[#f8faf7] px-3 py-2.5">

            <div className="flex items-center gap-2">

              <span className="relative flex h-2 w-2">

                <span className="absolute h-full w-full animate-ping rounded-full bg-[#2cad68] opacity-40" />

                <span className="relative h-2 w-2 rounded-full bg-[#2cad68]" />

              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#65726b]">
                System Online
              </span>

            </div>


            <span className="font-mono text-[9px] text-[#a0aaa4]">
              v2.0
            </span>

          </div>

        </div>


        {/* ==========================================
            NAVIGATION
        =========================================== */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">

          {NAVIGATION.map((section) => (

            <div
              key={section.title}
              className="mb-6"
            >

              {/* Section title */}

              <p className="mb-2 px-3 text-[9px] font-bold tracking-[0.16em] text-[#9aa39e]">
                {translate(language, section.title)}
              </p>


              {/* Navigation items */}

              <div className="space-y-1">

                {section.items.map((item) => {

                  const Icon = item.icon;

                  const basePath = item.href.split("?")[0];
                  const topic = new URLSearchParams(
                    item.href.split("?")[1] ?? ""
                  ).get("topic");

                  const isActive =
                    pathname === basePath &&
                    (topic
                      ? searchParams.get("topic") === topic
                      : !searchParams.has("topic"));

                  return (

                    <Link
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        group relative flex items-center gap-3
                        rounded-xl border px-3 py-2.5
                        transition-all duration-200

                        ${
                          isActive
                            ? "border-[#efb8c5] bg-[#fff1f4]"
                            : "border-transparent hover:border-[#e5eae4] hover:bg-[#f8faf7]"
                        }
                      `}
                    >

                      {/* Active indicator */}

                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-[#d97991]" />
                      )}


                      {/* Icon */}

                      <div
                        className={`
                          flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                          transition-colors

                          ${
                            isActive
                              ? "bg-[#fde1e8] text-[#c05a72]"
                              : "bg-[#f3f6f2] text-[#718079] group-hover:bg-[#edf7f0] group-hover:text-[#258355]"
                          }
                        `}
                      >
                        <Icon size={17} />
                      </div>


                      {/* Text */}

                      <div className="min-w-0 flex-1">

                        <p
                          className={`
                            truncate text-[12px] font-semibold

                            ${
                              isActive
                                ? "text-[#8f3f55]"
                                : "text-[#46544d] group-hover:text-[#17382b]"
                            }
                          `}
                        >
                          {translate(language, item.label)}
                        </p>

                        <p className="mt-0.5 truncate text-[9px] text-[#98a19c]">
                          {translate(language, item.description)}
                        </p>

                      </div>


                      {/* Arrow */}

                      <ChevronRight
                        size={14}
                        className="text-[#bdc5c0] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                      />

                    </Link>

                  );
                })}

              </div>

            </div>

          ))}

        </nav>


        {/* ==========================================
            MAIN CONTENT
        =========================================== */}

      </aside>

      {logoPreviewOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="SDIT logo preview"
          onClick={() => setLogoPreviewOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw] rounded-2xl bg-white p-3 shadow-2xl">
            <button
              type="button"
              aria-label="Close logo preview"
              onClick={() => setLogoPreviewOpen(false)}
              className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl text-[#17382b] shadow-lg"
            >
              <X size={18} />
            </button>
            <img
              src="/sdit-logo.jpg"
              alt="Shree Devi Institute of Technology logo"
              className="max-h-[82vh] max-w-[82vw] rounded-xl object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      )}


      {/* ============================================
          PAGE CONTENT
      ============================================= */}

      <main className="min-h-screen lg:pl-[292px]">

        {renderHeader && (
          <div className="pt-16 lg:pt-0">
            {renderHeader(() => setMobileOpen(true))}
          </div>
        )}

        {children}

      </main>

    </div>
  );
}