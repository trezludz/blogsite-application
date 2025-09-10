"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      alert("Signup successful! Please log in.");
      router.push("/login");
    } else {
      const err = await res.json();
      alert(`Signup failed: ${err.error || "Unknown error"}`);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border shadow-lg p-6 rounded-lg w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 border rounded mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
