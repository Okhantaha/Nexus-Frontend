import {
  ForgotPasswordPayload,
  LoginPayload,
  OtpVerifyPayload,
  RegisterPayload,
  ResetPasswordPayload,
  Token,
  User,
} from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Bir hata oluştu");
  }

  return data as T;
}

function authHeader(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    request<{ detail: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifyOtp: (payload: OtpVerifyPayload) =>
    request<Token>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginPayload) =>
    request<Token>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    request<{ detail: string }>("/api/auth/sifre-sifirla/istek", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resetPassword: (payload: ResetPasswordPayload) =>
    request<{ detail: string }>("/api/auth/sifre-sifirla/dogrula", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () =>
    request<User>("/api/auth/me", {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    }),
};

export interface MekanOneri {
  id: number;
  isim: string;
  adres: string | null;
  mutfak_turu: string | null;
  oy_sayisi: number;
  oy_kullandim: boolean;
  oneren: { id: number; isim: string; soyisim: string };
  created_at: string;
}

export interface SessionDurum {
  aktif: boolean;
  tarih: string | null;
  durum: string | null;
  mesaj: string;
}

function authRequest<T>(path: string, options?: RequestInit): Promise<T> {
  return request<T>(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(options?.headers ?? {}),
    },
  });
}

export const lunchApi = {
  sessionDurum: () =>
    authRequest<SessionDurum>("/api/lunch/session/durum"),

  oneriler: () =>
    authRequest<{ oneriler: MekanOneri[]; toplam: number }>("/api/lunch/oneriler"),

  oyVer: (mekanId: number) =>
    authRequest<{ mekan_id: number; oy_sayisi: number; oy_kullandim: boolean }>(
      `/api/lunch/oy/${mekanId}`,
      { method: "POST" }
    ),

  mekanOner: (payload: { isim: string; adres?: string; mutfak_turu?: string }) =>
    authRequest<MekanOneri>("/api/lunch/oner", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
