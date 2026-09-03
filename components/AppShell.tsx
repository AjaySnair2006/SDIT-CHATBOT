"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
  renderHeader: (openMenu: () => void) => React.ReactNode;
  onNewChat?: () => void;
  /** Chat page manages its own internal scroll region; other pages scroll normally. */
  fixedHeight?: boolean;
}

export default function AppShell({
  children,
  renderHeader,
  onNewChat,
  fixedHeight,
}: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-paper dark:bg-dark-bg">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNewChat={onNewChat}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {renderHeader(() => setMenuOpen(true))}
        <div
          className={
            fixedHeight
              ? "flex flex-1 flex-col overflow-hidden"
              : "flex-1 overflow-y-auto"
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
