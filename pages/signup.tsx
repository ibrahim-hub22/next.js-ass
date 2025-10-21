"use client";

import { useState } from "react";
import { authClient } from "@/lid/auth-client";
import { useRouter } from "next/router";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authClient.signUp.email({ email, password });
    if (res?.ok) router.push("/signin");
    else alert(res?.error ?? "Sign up failed");
  };

  return (
    <main style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Create Account</button>
      </form>
    </main>
  );
}
