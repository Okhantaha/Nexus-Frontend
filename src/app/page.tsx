"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
      <div style={{ width: 32, height: 32, border: "2px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );
}
