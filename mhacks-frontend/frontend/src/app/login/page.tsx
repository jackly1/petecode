"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { HomeIcon } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token in localStorage after successful login
      if (data.token) {
        localStorage.setItem("token", `Bearer ${data.token}`);
      }

      console.log("Login successful:", data.message);
      router.push("/"); // Redirect to home page upon successful login
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex flex-col">
      <header className="flex justify-between items-center p-4 bg-[#1c1f26]">
        <Image
          src="/favicon.ico"
          alt="PeteCode Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white">
            <a href="/">
              <div className="pl-[165px]">
                <HomeIcon className="lh-5 w-5" />
              </div>
            </a>
          </Button>
        </div>
        <div className="flex space-x-2">
          <a href="/dashboard">
            <Button variant="ghost" className="text-white">
              Dashboard
            </Button>
          </a>
          <a href="/create">
            <Button
              variant="outline"
              className="box-sign-login-orange-dim text-sign-login-orange hover:box-sign-login-orange-dim hover:text-white"
            >
              Sign Up
            </Button>
          </a>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8 gap-4">
        <div className="w-full max-w-3xl space-y-8">
          <div className="flex justify-center">
            <Image
              src="/petecodetext.png"
              alt="PeteCode"
              width={300}
              height={100}
              objectFit="contain"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-grow bg-[#1c1f26] border-[#2e323a] text-white placeholder-gray-400 py-1 px-2"
              />
            </div>
            <div className="flex space-x-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-grow bg-[#1c1f26] border-[#2e323a] text-white placeholder-gray-400 py-1 px-2"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#4caf50] hover:bg-[#45a049] text-white"
            >
              Log In
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
