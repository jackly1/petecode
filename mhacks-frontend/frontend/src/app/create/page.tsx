"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router

export default function RegisterComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error state before new request
    setSuccessMessage(""); // Reset success message state before new request

    try {
      const response = await fetch("http://localhost:8080/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      // Check if the response is okay
      if (!response.ok) {
        const errorText = await response.text(); // Read as text if not JSON
        console.error('Error response:', errorText); // Log the error response
        throw new Error(`Registration failed: ${errorText}`);
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      console.log('User registered successfully:', data.message);
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration failed:", error.message);
        setError(error.message);
      } else {
        console.error("Registration failed:", error);
        setError('An unknown error occurred');
      }
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
        <a href="/">
          <Button variant="ghost" className="text-white">
            <div className="pl-[153px]">
              <HomeIcon className="lh-5 w-5" />
            </div>
          </Button>
        </a>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-4">
            <a href="/dashboard">
              <Button variant="ghost" className="text-white">
                Dashboard
              </Button>
            </a>
          </div>
          <a href="/login">
            <Button
              variant="outline"
              className="box-sign-login-orange-dim text-sign-login-orange hover:box-sign-login-orange-dim hover:text-white"
            >
              Log In
            </Button>
          </a>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8">
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
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-grow bg-[#1c1f26] border-[#2e323a] text-white placeholder-gray-400 py-1 px-2"
                style={{ width: '40px' }}
              />
            </div>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              Sign Up
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
