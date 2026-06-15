"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { authApi } from "@/lib/api";
import type { Cinsiyet } from "@/types/auth";

const CINSIYET_OPTIONS: { label: string; value: Cinsiyet }[] = [
  { label: "Erkek", value: "erkek" },
  { label: "Kadın", value: "kadin" },
  { label: "Diğer", value: "diger" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ isim: "", soyisim: "", mail: "", sifre: "", cinsiyet: "erkek" as Cinsiyet });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.register(form);
      localStorage.setItem("otp_mail", form.mail);
      router.push("/verify-otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div style={{ marginBottom: 26 }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 14 }}>
          Aramıza katıl
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 38, lineHeight: 1.02 }}>
          Hesap oluştur
        </h1>
      </div>

      {error && (
        <div style={{ background: "rgba(255,92,0,.1)", border: "1px solid rgba(255,92,0,.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "var(--primary-soft)" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
            <Field label="İsim">
              <input type="text" placeholder="Ahmet" value={form.isim} onChange={e => setForm(f => ({ ...f, isim: e.target.value }))} required />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Soyisim">
              <input type="text" placeholder="Yılmaz" value={form.soyisim} onChange={e => setForm(f => ({ ...f, soyisim: e.target.value }))} required />
            </Field>
          </div>
        </div>

        <Field label="E-posta">
          <input type="email" placeholder="ad@sirket.com" value={form.mail} onChange={e => setForm(f => ({ ...f, mail: e.target.value }))} required />
        </Field>

        <Field label="Şifre">
          <input type="password" placeholder="En az 6 karakter" value={form.sifre} onChange={e => setForm(f => ({ ...f, sifre: e.target.value }))} minLength={6} required />
        </Field>

        <Field label="Cinsiyet">
          <div style={{ display: "flex", gap: 6, background: "var(--surface-2)", padding: 5, borderRadius: 14 }}>
            {CINSIYET_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, cinsiyet: opt.value }))}
                style={{
                  flex: 1, border: "none", cursor: "pointer",
                  fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600,
                  padding: "11px 6px", borderRadius: 10, transition: ".2s",
                  background: form.cinsiyet === opt.value ? "var(--surface)" : "transparent",
                  color: form.cinsiyet === opt.value ? "var(--ink)" : "var(--muted)",
                  boxShadow: form.cinsiyet === opt.value ? "0 10px 24px -16px rgba(0,0,0,.8)" : "none",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        <Button type="submit" loading={loading} style={{ marginTop: 14 }}>
          Kayıt Ol
        </Button>
      </form>

      <div style={{ marginTop: 20, paddingTop: 20, textAlign: "center" }}>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>Zaten üye misin? </span>
        <Link href="/login" style={{ color: "var(--primary)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          Giriş Yap
        </Link>
      </div>
    </AuthLayout>
  );
}
