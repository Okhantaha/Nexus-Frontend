"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "dark";
  loading?: boolean;
}

export default function Button({ variant = "primary", loading, children, disabled, className = "", style, ...props }: ButtonProps) {
  const base = "w-full cursor-pointer font-semibold text-base py-[17px] rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50";

  const variants: Record<string, string> = {
    primary: "bg-[var(--primary)] text-white border-none",
    ghost: "bg-transparent text-[var(--ink)] border border-[var(--line)]",
    dark: "bg-[var(--surface-2)] border border-[var(--line)] text-[var(--ink)]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      style={{ fontFamily: "var(--sans)", ...style }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      ) : children}
    </button>
  );
}
