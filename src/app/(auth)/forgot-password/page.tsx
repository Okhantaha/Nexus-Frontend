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
      <button onClick={() => router.back()} style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid var(--line)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink)", marginBottom: 24 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 14 }}>Şifre Sıfırla</p>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 38, lineHeight: 1.02 }}>Şifreni<br />unuttun mu?</h1>
        <p style={{ color: "var(--muted)", marginTop: 14, fontSize: 15, lineHeight: 1.5 }}>
          E-posta adresini gir, sıfırlama kodunu gönderelim.
        </p>
      </div>

      {error && (
        <div style={{ background: "rgba(255,92,0,.1)", border: "1px solid rgba(255,92,0,.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "var(--primary-soft)" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Field label="E-posta">
          <input type="email" placeholder="ad@sirket.com" value={mail} onChange={e => setMail(e.target.value)} required />
        </Field>
        <Button type="submit" loading={loading} style={{ marginTop: 8 }}>
          Kod Gönder
        </Button>
      </form>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Link href="/login" style={{ color: "var(--muted)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
          ← Girişe dön
        </Link>
      </div>
    </AuthLayout>
  );
}
