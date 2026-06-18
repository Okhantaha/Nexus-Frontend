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
      <div className="mb-6">
        <p className="text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--primary)] mb-3">
          Aramıza katıl
        </p>
        <h1 className="font-bold text-[34px] sm:text-[38px] leading-[1.02] text-[var(--ink)]" style={{ fontFamily: "var(--serif)" }}>
          Hesap oluştur
        </h1>
      </div>

      {error && (
        <div className="bg-[rgba(255,92,0,.1)] border border-[rgba(255,92,0,.3)] rounded-xl px-4 py-3 mb-4 text-sm text-[var(--primary-soft)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="flex-1">
            <Field label="İsim">
              <input type="text" placeholder="Ahmet" value={form.isim} onChange={e => setForm(f => ({ ...f, isim: e.target.value }))} required />
            </Field>
          </div>
          <div className="flex-1">
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
          <div className="flex gap-1.5 bg-[var(--surface-2)] p-[5px] rounded-[14px]">
            {CINSIYET_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, cinsiyet: opt.value }))}
                className={`flex-1 text-sm font-semibold py-[11px] px-1.5 rounded-[10px] transition-all duration-200 border-none cursor-pointer ${
                  form.cinsiyet === opt.value
                    ? "bg-[var(--surface)] text-[var(--ink)] shadow-[0_10px_24px_-16px_rgba(0,0,0,.8)]"
                    : "bg-transparent text-[var(--muted)]"
                }`}
                style={{ fontFamily: "var(--sans)" }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        <Button type="submit" loading={loading} className="mt-3">
          Kayıt Ol
        </Button>
      </form>

      <div className="mt-5 pt-5 text-center border-t border-[var(--line)]">
        <span className="text-[var(--muted)] text-sm">Zaten üye misin? </span>
        <Link href="/login" className="text-[var(--primary)] text-sm font-semibold no-underline">
          Giriş Yap
        </Link>
      </div>
    </AuthLayout>
  );
}
