"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { authApi } from "@/lib/api";

function maskEmail(email: string) {
  const [u, d] = email.split("@");
  if (!d) return email;
  return u.slice(0, 2) + "***@" + d;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [yeniSifre, setYeniSifre] = useState("");
  const [timer, setTimer] = useState(120);
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const m = localStorage.getItem("reset_mail") || "";
    setMail(m);
    if (!m) router.push("/forgot-password");
  }, [router]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const timerStr = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;

  function handleInput(i: number, val: string) {
    const v = val.replace(/[^0-9]/g, "").slice(0, 1);
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
      const next = [...otp];
      next[i - 1] = "";
      setOtp(next);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const data = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6).split("");
    const next = ["", "", "", "", "", ""];
    data.forEach((ch, j) => { next[j] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(data.length, 5)]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (otp.some(v => !v)) { setError("Lütfen 6 haneyi de gir"); return; }
    if (yeniSifre.length < 6) { setError("Şifre en az 6 karakter olmalı"); return; }
    setError("");
    setLoading(true);
    try {
      await authApi.resetPassword({ mail, otp: otp.join(""), yeni_sifre: yeniSifre });
      localStorage.removeItem("reset_mail");
      router.push("/login");
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

      <div className="mb-6">
        <p className="text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--primary)] mb-3">Yeni Şifre</p>
        <h1 className="font-bold text-[34px] sm:text-[38px] leading-[1.02] text-[var(--ink)]" style={{ fontFamily: "var(--serif)" }}>
          Kodu gir &<br />şifreni belirle
        </h1>
        <p className="text-[var(--muted)] mt-3 text-[15px] leading-relaxed">
          <span className="text-[var(--ink)] font-semibold">{maskEmail(mail)}</span> adresine gönderilen kodu gir.
        </p>
      </div>

      {error && (
        <div className="bg-[rgba(255,92,0,.1)] border border-[rgba(255,92,0,.3)] rounded-xl px-4 py-3 mb-4 text-sm text-[var(--primary-soft)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 sm:gap-[9px] mb-2" onPaste={handlePaste}>
          {otp.map((v, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              value={v}
              onChange={e => handleInput(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              maxLength={1}
              inputMode="numeric"
              type="tel"
              className="flex-1 w-0 text-center outline-none rounded-[14px] text-[var(--ink)] transition-all duration-200"
              style={{
                aspectRatio: "1/1.18",
                border: `1.5px solid ${v ? "var(--primary)" : "var(--line)"}`,
                background: v ? "var(--surface-2)" : "var(--surface)",
                fontFamily: "var(--serif)",
                fontSize: "clamp(20px, 5vw, 28px)",
                fontWeight: 600,
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mx-0.5 my-5">
          <span className="text-[var(--muted)] text-sm">Kalan süre</span>
          <span className="font-semibold text-lg" style={{ fontFamily: "var(--serif)", color: timer > 0 ? "var(--primary)" : "var(--muted)" }}>{timerStr}</span>
        </div>

        <Field label="Yeni Şifre">
          <input type="password" placeholder="En az 6 karakter" value={yeniSifre} onChange={e => setYeniSifre(e.target.value)} minLength={6} required />
        </Field>

        <Button type="submit" loading={loading} className="mt-2">
          Şifremi Güncelle
        </Button>
      </form>
    </AuthLayout>
  );
}
