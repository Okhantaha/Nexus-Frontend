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
      <button onClick={() => router.back()} style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid var(--line)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink)", marginBottom: 24 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 14 }}>Yeni Şifre</p>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 38, lineHeight: 1.02 }}>Kodu gir &<br />şifreni belirle</h1>
        <p style={{ color: "var(--muted)", marginTop: 14, fontSize: 15, lineHeight: 1.5 }}>
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>{maskEmail(mail)}</span> adresine gönderilen kodu gir.
        </p>
      </div>

      {error && (
        <div style={{ background: "rgba(255,92,0,.1)", border: "1px solid rgba(255,92,0,.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "var(--primary-soft)" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: 9, margin: "0 0 8px" }} onPaste={handlePaste}>
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
              style={{
                flex: 1, width: 0, aspectRatio: "1/1.18", textAlign: "center",
                border: `1.5px solid ${v ? "var(--primary)" : "var(--line)"}`,
                background: v ? "var(--surface-2)" : "var(--surface)",
                borderRadius: 14,
                fontFamily: "var(--serif)", fontSize: 28, fontWeight: 600, color: "var(--ink)",
                outline: "none",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 2px 20px" }}>
          <span style={{ color: "var(--muted)", fontSize: 14 }}>Kalan süre</span>
          <span style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 18, color: timer > 0 ? "var(--primary)" : "var(--muted)" }}>{timerStr}</span>
        </div>

        <Field label="Yeni Şifre">
          <input type="password" placeholder="En az 6 karakter" value={yeniSifre} onChange={e => setYeniSifre(e.target.value)} minLength={6} required />
        </Field>

        <Button type="submit" loading={loading} style={{ marginTop: 8 }}>
          Şifremi Güncelle
        </Button>
      </form>
    </AuthLayout>
  );
}
