"use client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "radial-gradient(circle at 50% 0%, #1a1a1a, #000)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7h18M3 7l1.5 12.5a1 1 0 0 0 1 .9h11a1 1 0 0 0 1-.9L19 7M8 7V5a4 4 0 0 1 8 0v2"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.01em" }}>LunchSwipe</span>
        </div>
        {children}
      </div>
    </div>
  );
}
