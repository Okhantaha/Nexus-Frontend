"use client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(circle_at_50%_0%,#1a1a1a,#000)]">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--primary)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7h18M3 7l1.5 12.5a1 1 0 0 0 1 .9h11a1 1 0 0 0 1-.9L19 7M8 7V5a4 4 0 0 1 8 0v2"/>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--serif)" }}>LunchSwipe</span>
        </div>
        {children}
      </div>
    </div>
  );
}
