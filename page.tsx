"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Login() {
  const sb = supabaseBrowser();
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [msg, setMsg] = useState("");
  const go = async (mode: "in" | "up") => {
    const redirectTo = `${location.origin}/auth/callback`;
    const { error } = mode === "in" ? await sb.auth.signInWithPassword({ email, password })
      : await sb.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
    setMsg(error ? error.message : mode === "up" ? "Check your email to confirm your account." : "Signed in.");
    if (!error && mode === "in") location.href = "/";
  };
  const google = () => sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback` } });
  return (
    <main className="mx-auto max-w-sm space-y-3 p-6">
      <h1 className="text-2xl font-bold">Sign in to ECHO EARTH</h1>
      <input className="w-full rounded border p-2 text-black" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2 text-black" type="password" placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="flex gap-2"><button onClick={() => go("in")}>Sign in</button><button onClick={() => go("up")}>Create account</button><button onClick={google}>Google</button></div>
      <p role="status">{msg}</p>
    </main>
  );
}
