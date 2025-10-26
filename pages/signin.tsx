"use client";

import { useState } from "react";
import { authClient } from "@/lid/auth-client";
import { useRouter } from "next/router";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authClient.signIn.email({ email, password });
      if (res.data) {
        router.push("/dashboard");
      } else {
        alert(res.error?.message ?? "Login failed");
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Sign In</h2>
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
        <button type="submit">Sign In</button>
      </form>
    </main>
  );
}
