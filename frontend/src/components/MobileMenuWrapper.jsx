"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

export default function MobileMenuWrapper({ user }) {
  const [open, setOpen] = useState(false);

  // Keep keyboard navigation consistent with modal behavior
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent the page behind the menu from scrolling
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeTab = () => {
    setOpen(false);
  };

  return (
    <div className={open ? "mobile-menu-open" : ""}>
      <div className="mobile-topbar">
        <span className="mobile-topbar-title">PR Forge</span>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="mobile-menu-btn"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="sidebar-backdrop" onClick={() => setOpen(false)} />

      <Sidebar user={user} onNavigate={closeTab} />
    </div>
  );
}
