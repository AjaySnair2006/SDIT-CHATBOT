"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  MessageCircle,
  MapPin,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Users,
  Building2,
  X,
  ChevronRight,
  Activity,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  renderHeader?: (openMenu: () => void) => React.ReactNode;
  fixedHeight?: boolean;
  onNewChat?: () => void;
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
        href: "/about",
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
];

export default function AppShell({
  children,
  renderHeader,
}: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#17382b]">

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =====================================================
          FLOATING SIDEBAR
      ====================================================== */}

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

        {/* =================================================
            BRAND
        ================================================== */}

        <div className="border-b border-[#edf0eb] px-5 pb-5 pt-6">

          <div className="flex items-center justify-between">

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3"
            >

              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#d9b24c]/40 bg-[#fffaf0]">

                <Sparkles
                  size={21}
                  className="text-[#bd8f2b]"
                />

                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#2cad68]" />

              </div>

              <div>
                <p className="text-[17px] font-bold tracking-wide text-[#17382b]">
                  SDIT AI
                </p>

                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-[#8b9690]">
                  Smart Campus
                </p>
              </div>

            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-[#7e8983] hover:bg-[#f5f7f4] lg:hidden"
            >
              <X size={18} />
            </button>

          </div>


          {/* Online status */}

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


        {/* =================================================
            NAVIGATION
        ================================================== */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">

          {NAVIGATION.map((section) => (

            <div
              key={section.title}
              className="mb-6"
            >

              <p className="mb-2 px-3 text-[9px] font-bold tracking-[0.16em] text-[#9aa39e]">
                {section.title}
              </p>

              <div className="space-y-1">

                {section.items.map((item) => {

                  const Icon = item.icon;

                  const basePath = item.href.split("?")[0];

                  const isActive =
                    basePath === "/"
                      ? pathname === "/"
                      : pathname === basePath;

                  return (

                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        group relative flex items-center gap-3
                        rounded-xl border px-3 py-2.5
                        transition-all duration-200
                        ${
                          isActive
                            ? "border-[#e2c875] bg-[#fffaf0]"
                            : "border-transparent hover:border-[#e5eae4] hover:bg-[#f8faf7]"
                        }
                      `}
                    >

                      {/* Active line */}

                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-[#c3942d]" />
                      )}


                      {/* Icon */}

                      <div
                        className={`
                          flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                          transition-colors
                          ${
                            isActive
                              ? "bg-[#fdf3d9] text-[#b68725]"
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
                                ? "text-[#17382b]"
                                : "text-[#46544d] group-hover:text-[#17382b]"
                            }
                          `}
                        >
                          {item.label}
                        </p>

                        <p className="mt-0.5 truncate text-[9px] text-[#98a19c]">
                          {item.description}
                        </p>

                      </div>


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


        {/* =================================================
            AI CORE
        ================================================== */}

        <div className="p-3">

          <div className="rounded-2xl border border-[#e3e8e1] bg-[#fafbf9] p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf8f1] text-[#24945a]">
                <Activity size={18} />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#35443c]">
                  AI Core
                </p>

                <p className="mt-0.5 text-[9px] text-[#929b95]">
                  Knowledge engine active
                </p>

              </div>

            </div>


            {/* Progress */}

            <div className="mt-4">

              <div className="flex items-center justify-between">

                <span className="text-[9px] text-[#89938d]">
                  Knowledge Index
                </span>

                <span className="text-[10px] font-bold text-[#17382b]">
                  98.7%
                </span>

              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e4e9e3]">

                <div className="h-full w-[98.7%] rounded-full bg-[#2cad68]" />

              </div>

            </div>


            {/* Activity */}

            <div className="mt-4 flex h-7 items-end gap-1">

              {[30, 55, 35, 70, 45, 80, 40, 65, 30, 60, 45, 75].map(
                (height, index) => (

                  <span
                    key={index}
                    className="flex-1 rounded-full bg-[#a8d9ba]"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                )
              )}

            </div>

          </div>


          <p className="pb-1 pt-3 text-center text-[8px] uppercase tracking-[0.1em] text-[#a1aaa5]">
            Shree Devi Institute of Technology
          </p>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

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