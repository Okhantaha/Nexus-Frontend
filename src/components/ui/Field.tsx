"use client";

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export default function Field({ label, error, children }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-[var(--ink)] mb-[7px] tracking-[.01em]">
        {label}
      </label>
      {children}
      {error && <p className="text-[var(--primary)] text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}
