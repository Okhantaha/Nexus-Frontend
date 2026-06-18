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
      <div className="mb-9">
        <p className="text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--primary)] mb-4">
          Öğlen molası, yeniden keşfedildi
        </p>
        <h1 className="font-bold text-[38px] sm:text-[42px] leading-[1.02] tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--serif)" }}>
          Ekibinle<br />bugün <em className="text-[var(--primary)] italic">nerede</em><br />yiyorsunuz?
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
        <Button type="submit" loading={loading} className="mt-2">
          Giriş Yap
        </Button>
      </form>

      <div className="text-center my-5">
        <Link href="/forgot-password" className="text-[var(--muted)] text-sm font-medium no-underline hover:text-[var(--ink)] transition-colors">
          Şifremi unuttum
        </Link>
      </div>

      <div className="pt-4 text-center border-t border-[var(--line)]">
        <span className="text-[var(--muted)] text-sm">Hesabın yok mu? </span>
        <Link href="/register" className="text-[var(--primary)] text-sm font-semibold no-underline">
          Kayıt Ol
        </Link>
      </div>
    </AuthLayout>
  );
}
