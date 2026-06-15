"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { authApi } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mail, setMail] = useState("");
  const [sifre, setSifre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login({ mail, sifre });
      setToken(res.access_token);
      localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div style={{ marginBottom: 38 }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 16 }}>
          Öğlen molası, yeniden keşfedildi
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 42, lineHeight: 1.02, letterSpacing: "-.01em" }}>
          Ekibinle<br />bugün <em style={{ color: "var(--primary)", fontStyle: "italic" }}>nerede</em><br />yiyorsunuz?
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Field label="E-posta" error={error}>
          <input
            type="email"
            placeholder="ad@sirket.com"
            value={mail}
            onChange={e => setMail(e.target.value)}
            autoComplete="email"
            required
          />
        </Field>
        <Field label="Şifre">
          <input
            type="password"
            placeholder="••••••••"
            value={sifre}
            onChange={e => setSifre(e.target.value)}
            autoComplete="current-password"
            required
          />
        </Field>
        <Button type="submit" loading={loading} style={{ marginTop: 8 }}>
          Giriş Yap
        </Button>
      </form>

      <div style={{ textAlign: "center", margin: "22px 0" }}>
        <Link href="/forgot-password" style={{ color: "var(--muted)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
          Şifremi unuttum
        </Link>
      </div>

      <div style={{ marginTop: "auto", paddingTop: 18, textAlign: "center", borderTop: "1px solid var(--line)" }}>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>Hesabın yok mu? </span>
        <Link href="/register" style={{ color: "var(--primary)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          Kayıt Ol
        </Link>
      </div>
    </AuthLayout>
  );
}
