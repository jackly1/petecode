"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { HomeIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function Dashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState("Python");
  const [url, setURL] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // Add Authorization header only if the token exists
        if (token) {
          headers["Authorization"] = token;
        }

        const response = await fetch("http://localhost:8080/check_user", {
          method: "GET",
          headers,
        });

        const data = await response.json();
        if (data.logged_in) {
          setUser(data.email); // Store user's email or relevant data
        }
      } catch (err) {
        console.error("Failed to check user session:", err);
      }
    };

    checkUserLoggedIn();
  }, []);

  const languages = ["Python", "C++", "Java", "Rust", "Go", "C"];

  const validateURL = (url: string) => {
    const leetCodeRegex = /^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+$/;
    return leetCodeRegex.test(url);
  };

  const passURL = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateURL(url)) {
      setError(
        "Please enter a valid LeetCode problem URL like https://leetcode.com/problems/{problem_name}"
      );
      return;
    }
    setError("");
    const encodedURL = encodeURIComponent(url);
    const encodedLanguage = encodeURIComponent(selectedLanguage);
    router.push(`/answer?url=${encodedURL}&language=${encodedLanguage}`);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex flex-col">
      <header className="flex justify-between items-center p-4 bg-[#1c1f26]">
        <a href="/">
          <Image
            src="/favicon.ico"
            alt="PeteCode Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </a>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white">
            <div className="pl-[250px]">
              <HomeIcon className="lh-5 w-5" />
            </div>
          </Button>
        </div>
        <div className="flex space-x-2">
          <a href="/dashboard">
            <Button variant="ghost" className="text-white">
              Dashboard
            </Button>
          </a>
          {!user && ( // Conditionally render buttons if user is not logged in
            <>
              <a href="/create">
                <Button
                  variant="outline"
                  className="box-sign-login-orange-dim text-sign-login-orange hover:box-sign-login-orange-dim hover:text-white"
                >
                  Sign Up
                </Button>
              </a>
              <a href="/login">
                <Button
                  variant="outline"
                  className="box-sign-login-orange-dim text-sign-login-orange hover:box-sign-login-orange-dim hover:text-white"
                >
                  Log In
                </Button>
              </a>
            </>
          )}
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
          <form onSubmit={passURL} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Insert LeetCode URL..."
                value={url}
                onChange={(e) => {
                  setURL(e.target.value);
                  setError(""); // Clear error when input changes
                }}
                className="flex-grow bg-[#1c1f26] border-[#2e323a] text-white placeholder-gray-400"
              />
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-[115px] bg-[#1c1f26] border-[#2e323a] text-purple-400">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="w-[180px] bg-[#1c1f26] border-[#2e323a]">
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang}
                      value={lang}
                      className="px-2 py-2 text-white hover:bg-[#2e323a]"
                    >
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <Button
              type="submit"
              className="w-full bg-[#4caf50] hover:bg-[#45a049] text-white"
            >
              Solve
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
