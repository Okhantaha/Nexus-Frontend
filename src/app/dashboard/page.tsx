"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/lib/auth";
import { lunchApi, MekanOneri, SessionDurum } from "@/lib/api";

interface UserInfo {
  isim?: string;
  soyisim?: string;
  mail?: string;
  cinsiyet?: string;
}

function NavBar({ active }: { active: string }) {
  const items = [
    { key: "bugun", label: "Bugün", href: "/dashboard", icon: HomeIcon },
    { key: "sonuclar", label: "Sonuçlar", href: "/dashboard/sonuclar", icon: ChartIcon },
    { key: "gecmis", label: "Geçmiş", href: "/dashboard/gecmis", icon: ClockIcon },
    { key: "profil", label: "Profil", href: "/dashboard/profil", icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-center pb-safe">
      <div className="w-full max-w-md mx-auto">
        <div
          className="flex items-center justify-around px-2 pt-3 pb-6"
          style={{ background: "rgba(10,10,10,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--line)" }}
        >
          {items.slice(0, 2).map(({ key, label, href, icon: Icon }) => (
            <Link key={key} href={href} className="flex flex-col items-center gap-1 min-w-[52px] no-underline">
              <Icon active={active === key} />
              <span
                className="text-[10px] font-semibold"
                style={{ color: active === key ? "var(--primary)" : "var(--muted)" }}
              >
                {label}
              </span>
            </Link>
          ))}

          {/* FAB */}
          <Link
            href="/dashboard/oner"
            className="flex items-center justify-center w-14 h-14 rounded-full -mt-6 shadow-lg no-underline"
            style={{ background: "var(--primary)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Link>

          {items.slice(2).map(({ key, label, href, icon: Icon }) => (
            <Link key={key} href={href} className="flex flex-col items-center gap-1 min-w-[52px] no-underline">
              <Icon active={active === key} />
              <span
                className="text-[10px] font-semibold"
                style={{ color: active === key ? "var(--primary)" : "var(--muted)" }}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "var(--primary)" : "none"} stroke={active ? "var(--primary)" : "var(--muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--primary)" : "var(--muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
}

function ClockIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--primary)" : "var(--muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--primary)" : "var(--muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function VenueCard({ venue, onVote }: { venue: MekanOneri; onVote: (id: number) => Promise<void> }) {
  const [voted, setVoted] = useState(venue.oy_kullandim);
  const [oyCount, setOyCount] = useState(venue.oy_sayisi);
  const [loading, setLoading] = useState(false);

  async function handleVote() {
    if (loading) return;
    setLoading(true);
    const prev = { voted, oyCount };
    setVoted(v => !v);
    setOyCount(c => voted ? c - 1 : c + 1);
    try {
      await onVote(venue.id);
    } catch {
      setVoted(prev.voted);
      setOyCount(prev.oyCount);
    } finally {
      setLoading(false);
    }
  }

  const maxVotes = 20;
  const pct = Math.min(100, Math.round((oyCount / maxVotes) * 100));

  return (
    <div
      className="rounded-2xl overflow-hidden flex-shrink-0 w-[220px]"
      style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
    >
      {/* Image placeholder */}
      <div
        className="w-full h-[130px] flex items-end justify-start p-3 relative overflow-hidden"
        style={{
          background: "repeating-linear-gradient(45deg, #1a1a1a 0px, #1a1a1a 10px, #141414 10px, #141414 20px)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}
        />
        <span className="relative text-[11px] font-semibold text-[var(--muted)]">fotoğraf yok</span>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="font-semibold text-sm text-[var(--ink)] leading-tight">{venue.isim}</p>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">{venue.mutfak_turu ?? "Mekan"}{venue.adres ? ` · ${venue.adres}` : ""}</p>
          </div>
          <button
            onClick={handleVote}
            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: voted ? "var(--primary)" : "var(--surface-2)",
              border: "1px solid " + (voted ? "var(--primary)" : "var(--line)"),
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={voted ? "#fff" : "none"} stroke={voted ? "#fff" : "var(--muted)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>

        {/* Vote bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[var(--muted)]">{oyCount} oy</span>
            <span className="text-[10px] text-[var(--muted)]">{pct}%</span>
          </div>
          <div className="w-full h-1 rounded-full" style={{ background: "var(--line)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: "var(--primary)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo>({});
  const [tab, setTab] = useState<"ai" | "team">("ai");
  const [oneriler, setOneriler] = useState<MekanOneri[]>([]);
  const [sessionDurum, setSessionDurum] = useState<SessionDurum | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }

    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    } else {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ isim: payload.isim, soyisim: payload.soyisim, mail: payload.mail, cinsiyet: payload.cinsiyet });
      } catch {}
    }

    Promise.all([
      lunchApi.sessionDurum().catch(() => null),
      lunchApi.oneriler().catch(() => ({ oneriler: [], toplam: 0 })),
    ]).then(([durum, oneriRes]) => {
      setSessionDurum(durum);
      setOneriler(oneriRes?.oneriler ?? []);
      setLoadingData(false);
    });
  }, [router]);

  async function handleOy(mekanId: number) {
    await lunchApi.oyVer(mekanId);
    const res = await lunchApi.oneriler();
    setOneriler(res.oneriler);
  }

  const today = new Date();
  const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]}`;
  const timeStr = today.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  const totalVotes = oneriler.reduce((sum, o) => sum + o.oy_sayisi, 0);
  const toplamOneri = oneriler.length;

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg)" }}>
      <div className="max-w-md mx-auto px-5">

        {/* Header */}
        <div className="flex items-center justify-between pt-14 pb-2">
          <div>
            <p className="text-[12px] text-[var(--muted)] font-medium">{dateStr}</p>
            <p className="text-[22px] font-bold text-[var(--ink)] leading-tight" style={{ fontFamily: "var(--serif)" }}>
              {timeStr}
            </p>
          </div>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-[var(--ink)]"
            style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
          >
            {user.isim?.[0]?.toUpperCase() ?? "?"}
          </button>
        </div>

        {/* Greeting */}
        <h1
          className="text-[28px] font-bold text-[var(--ink)] mt-5 mb-4"
          style={{ fontFamily: "var(--serif)" }}
        >
          Merhaba, {user.isim ?? "..."}
        </h1>

        {/* Voting session card */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{ background: "linear-gradient(135deg, #2A1000 0%, #1A0A00 100%)", border: "1px solid #3D1800" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: sessionDurum?.aktif ? "var(--primary)" : "var(--muted)" }}
            />
            <span className="text-[11px] font-semibold" style={{ color: sessionDurum?.aktif ? "var(--primary)" : "var(--muted)" }}>
              {sessionDurum?.aktif ? "Oylama açık" : (sessionDurum?.mesaj ?? "Yükleniyor...")}
            </span>
          </div>
          <p className="font-bold text-[18px] text-[var(--ink)] mb-1" style={{ fontFamily: "var(--serif)" }}>
            Bugün nerede yiyoruz?
          </p>
          <p className="text-[12px] text-[var(--muted)] mb-3">
            {sessionDurum?.aktif
              ? `Oylama 12:00'de kapanıyor · ${totalVotes} oy`
              : `${toplamOneri} mekan önerildi · ${totalVotes} oy`}
          </p>
          <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,92,0,0.2)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: toplamOneri > 0 ? "100%" : "0%", background: "var(--primary)" }}
            />
          </div>
        </div>

        {/* Venue section */}
        <div className="mb-4">
          <h2 className="text-[18px] font-bold text-[var(--ink)] mb-3" style={{ fontFamily: "var(--serif)" }}>
            Önerilen mekanlar
          </h2>

          {/* Tabs */}
          <div className="flex gap-0 mb-4" style={{ borderBottom: "1px solid var(--line)" }}>
            <button
              onClick={() => setTab("ai")}
              className="flex items-center gap-1.5 pb-2 px-1 mr-4 text-sm font-semibold transition-colors border-b-2"
              style={{
                color: tab === "ai" ? "var(--ink)" : "var(--muted)",
                borderColor: tab === "ai" ? "var(--primary)" : "transparent",
              }}
            >
              ✦ AI Önerileri
            </button>
            <button
              onClick={() => setTab("team")}
              className="flex items-center gap-1.5 pb-2 px-1 text-sm font-semibold transition-colors border-b-2"
              style={{
                color: tab === "team" ? "var(--ink)" : "var(--muted)",
                borderColor: tab === "team" ? "var(--primary)" : "transparent",
              }}
            >
              👥 Ekip Önerileri
            </button>
          </div>

          {/* Horizontal scroll cards */}
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {loadingData ? (
              <div className="flex items-center justify-center w-full py-8">
                <div className="w-6 h-6 rounded-full border-2 border-[var(--primary)] border-t-transparent" style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ) : oneriler.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full py-8 gap-2">
                <p className="text-[var(--muted)] text-sm">Henüz mekan önerisi yok</p>
                <p className="text-[var(--muted)] text-xs">+ butonuyla ilk öneriyi sen yap</p>
              </div>
            ) : (
              oneriler.map(venue => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onVote={handleOy}
                />
              ))
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div
            className="rounded-2xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
          >
            <p className="text-[11px] text-[var(--muted)] font-medium mb-1">Bu hafta</p>
            <p className="text-2xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--serif)" }}>4</p>
            <p className="text-[11px] text-[var(--muted)]">öğle yemeği</p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
          >
            <p className="text-[11px] text-[var(--muted)] font-medium mb-1">Katılım oranı</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "var(--serif)", color: "var(--primary)" }}>%87</p>
            <p className="text-[11px] text-[var(--muted)]">ekip oyladı</p>
          </div>
        </div>

      </div>

      <NavBar active="bugun" />
    </div>
  );
}
