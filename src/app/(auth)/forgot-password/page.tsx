"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword({ mail });
      localStorage.setItem("reset_mail", mail);
      router.push("/reset-password");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <button
        onClick={() => router.back()}
        className="w-[42px] h-[42px] rounded-full border border-[var(--line)] bg-[var(--surface)] flex items-center justify-center cursor-pointer text-[var(--ink)] mb-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div className="mb-8">
        <p className="text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--primary)] mb-3">Şifre Sıfırla</p>
        <h1 className="font-bold text-[34px] sm:text-[38px] leading-[1.02] text-[var(--ink)]" style={{ fontFamily: "var(--serif)" }}>
          Şifreni<br />unuttun mu?
        </h1>
        <p className="text-[var(--muted)] mt-3 text-[15px] leading-relaxed">
          E-posta adresini gir, sıfırlama kodunu gönderelim.
        </p>
      </div>

      {error && (
        <div className="bg-[rgba(255,92,0,.1)] border border-[rgba(255,92,0,.3)] rounded-xl px-4 py-3 mb-4 text-sm text-[var(--primary-soft)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Field label="E-posta">
          <input type="email" placeholder="ad@sirket.com" value={mail} onChange={e => setMail(e.target.value)} required />
        </Field>
        <Button type="submit" loading={loading} className="mt-2">
          Kod Gönder
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-[var(--muted)] text-sm font-medium no-underline hover:text-[var(--ink)] transition-colors">
          ← Girişe dön
        </Link>
      </div>
    </AuthLayout>
  );
}
