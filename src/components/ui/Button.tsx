"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "dark";
  loading?: boolean;
}

export default function Button({ variant = "primary", loading, children, disabled, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    width: "100%", border: "none", cursor: "pointer",
    fontFamily: "var(--sans)", fontSize: 16, fontWeight: 600,
    padding: "17px", borderRadius: 16,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "filter .2s, opacity .2s, transform .15s",
    opacity: disabled || loading ? 0.5 : 1,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "var(--primary)", color: "#fff" },
    ghost: { background: "transparent", color: "var(--ink)", border: "1.5px solid var(--line)" },
    dark: { background: "var(--surface-2)", border: "1.5px solid var(--line)", color: "var(--ink)" },
  };

  return (
    <button
      style={{ ...base, ...variants[variant] }}
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
