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
      <button
        onClick={() => router.back()}
        className="w-[42px] h-[42px] rounded-full border border-[var(--line)] bg-[var(--surface)] flex items-center justify-center cursor-pointer text-[var(--ink)] mb-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div className="mb-2">
        <p className="text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--primary)] mb-3">Doğrulama</p>
        <h1 className="font-bold text-[34px] sm:text-[38px] leading-[1.02] text-[var(--ink)]" style={{ fontFamily: "var(--serif)" }}>
          E-postanızı<br />doğrulayın
        </h1>
        <p className="text-[var(--muted)] mt-3 text-[15px] leading-relaxed">
          <span className="text-[var(--ink)] font-semibold">{maskEmail(mail)}</span> adresine<br />gönderdiğimiz 6 haneli kodu gir.
        </p>
      </div>

      {error && (
        <div className="bg-[rgba(255,92,0,.1)] border border-[rgba(255,92,0,.3)] rounded-xl px-4 py-3 mb-2 text-sm text-[var(--primary-soft)]">
          {error}
        </div>
      )}

      <div className="flex gap-2 sm:gap-[9px] mt-8 mb-2" onPaste={handlePaste}>
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

      <Button onClick={handleVerify} loading={loading} className="mt-2">
        Doğrula
      </Button>

      <div className="text-center mt-6">
        <span className="text-[var(--muted)] text-sm">Kod gelmedi mi? </span>
        <button
          onClick={handleResend}
          disabled={timer > 0}
          className="bg-none border-none text-[var(--primary)] font-semibold text-sm cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--sans)", background: "none" }}
        >
          Kodu Tekrar Gönder
        </button>
      </div>
    </AuthLayout>
  );
}
