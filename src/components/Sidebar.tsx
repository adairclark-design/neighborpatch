"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const NAV = [
  {
    section: "Marketplace",
    items: [
      { icon: "🗺️", label: "Find a Plot",     href: "/",                  badge: null },
      { icon: "🌱", label: "My Plot",          href: "/dashboard/my-plot", badge: null },
      { icon: "📬", label: "Inbox",            href: "/dashboard/inbox",   badge: "2"  },
    ],
  },
  {
    section: "Tools",
    items: [
      { icon: "📋", label: "Harvest Log",      href: "/dashboard/plot/123/log",     badge: null },
      { icon: "📄", label: "My Agreement",     href: "/dashboard/contracts/sign",   badge: null },
      { icon: "🎓", label: "Academy",          href: "/academy",                    badge: null },
    ],
  },
  {
    section: "Account",
    items: [
      { icon: "⚙️", label: "Settings",         href: "/settings",   badge: null },
      { icon: "🏠", label: "List My Yard",     href: "/list-yard",  badge: null },
    ],
  },
];

export default function Sidebar({ role = "gardener" }: { role?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
          {/* House Base */}
          <path d="M50 15L15 45v40h70V45L50 15z" stroke="var(--brand-earth)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          {/* Internal Sprouting Leaf */}
          <path d="M50 85C50 65 35 55 25 50C35 45 45 50 50 65C50 50 60 35 70 30C60 25 50 35 50 50" stroke="var(--brand-green)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M50 85V45" stroke="var(--brand-green)" strokeWidth="6" strokeLinecap="round"/>
        </svg>
        <div>
          <div className="logo-text" style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            <span style={{ color: "var(--text-primary)" }}>Neighbor</span>
            <span style={{ color: "var(--brand-green)" }}>Patch</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      {NAV.map((group) => (
        <div key={group.section}>
          <div className="nav-section-label">{group.section}</div>
          {group.items.map((item) => (
            <button
              key={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
              onClick={() => router.push(item.href)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </div>
      ))}

      {/* User */}
      <div className="sidebar-user">
        <div className="user-avatar">JD</div>
        <div>
          <div className="user-name">John Doe</div>
          <div className="user-role">{role === "owner" ? "Yard Owner" : "Gardener"} · <span className="color-green">Verified ✓</span></div>
        </div>
      </div>
    </aside>
  );
}
