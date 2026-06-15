export type Cinsiyet = "erkek" | "kadin" | "diger";

export interface User {
  id: number;
  isim: string;
  soyisim: string;
  mail: string;
  cinsiyet: Cinsiyet;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterPayload {
  isim: string;
  soyisim: string;
  mail: string;
  cinsiyet: Cinsiyet;
  sifre: string;
}

export interface LoginPayload {
  mail: string;
  sifre: string;
}

export interface OtpVerifyPayload {
  mail: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  mail: string;
}

export interface ResetPasswordPayload {
  mail: string;
  otp: string;
  yeni_sifre: string;
}

export interface ApiError {
  detail: string;
}
