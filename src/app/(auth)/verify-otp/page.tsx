"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/ui/Button";
import { authApi } from "@/lib/api";
import { setToken } from "@/lib/auth";

function maskEmail(email: string) {
  const [u, d] = email.split("@");
  if (!d) return email;
  return u.slice(0, 2) + "***@" + d;
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mail, setMail] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const m = localStorage.getItem("otp_mail") || "";
    setMail(m);
    if (!m) router.push("/register");
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

  async function handleVerify() {
    if (otp.some(v => !v)) { setError("Lütfen 6 haneyi de gir"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ mail, otp: otp.join("") });
      setToken(res.access_token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.removeItem("otp_mail");
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Doğrulama başarısız");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      await authApi.register({ isim: "", soyisim: "", mail, cinsiyet: "erkek", sifre: "" });
    } catch { /* ignore */ }
    setTimer(120);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  }

  return (
    <AuthLayout>
      <button onClick={() => router.back()} style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid var(--line)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink)", marginBottom: 24 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 14 }}>Doğrulama</p>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 38, lineHeight: 1.02 }}>E-postanızı<br />doğrulayın</h1>
        <p style={{ color: "var(--muted)", marginTop: 14, fontSize: 15, lineHeight: 1.5 }}>
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>{maskEmail(mail)}</span> adresine<br />gönderdiğimiz 6 haneli kodu gir.
        </p>
      </div>

      {error && (
        <div style={{ background: "rgba(255,92,0,.1)", border: "1px solid rgba(255,92,0,.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 8, fontSize: 14, color: "var(--primary-soft)" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 9, margin: "32px 0 8px" }} onPaste={handlePaste}>
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
              transition: "border-color .2s, box-shadow .2s",
              outline: "none",
            }}
          />
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "22px 2px" }}>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>Kalan süre</span>
        <span style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 18, color: timer > 0 ? "var(--primary)" : "var(--muted)" }}>{timerStr}</span>
      </div>

      <Button onClick={handleVerify} loading={loading} style={{ marginTop: 10 }}>
        Doğrula
      </Button>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>Kod gelmedi mi? </span>
        <button
          onClick={handleResend}
          disabled={timer > 0}
          style={{ background: "none", border: "none", color: "var(--primary)", fontFamily: "var(--sans)", fontWeight: 600, fontSize: 14, cursor: timer > 0 ? "not-allowed" : "pointer", opacity: timer > 0 ? 0.45 : 1 }}
        >
          Kodu Tekrar Gönder
        </button>
      </div>
    </AuthLayout>
  );
}
