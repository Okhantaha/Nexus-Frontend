"use client";

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export default function Field({ label, error, children }: FieldProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 7, letterSpacing: ".01em" }}>
        {label}
      </label>
      {children}
      {error && <p style={{ color: "var(--primary)", fontSize: 12, marginTop: 5, fontWeight: 500 }}>{error}</p>}
    </div>
  );
}
