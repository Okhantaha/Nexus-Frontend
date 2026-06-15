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
