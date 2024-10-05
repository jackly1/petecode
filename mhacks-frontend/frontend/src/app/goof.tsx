"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { GithubIcon, MailIcon, HomeIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ChevronDown } from "lucide-react";

export default function Component() {
  // handles the dropdown menu
  const [selectedLanguage, setSelectedLanguage] = useState("Python");

  const languages = ["Python", "C++", "Java", "Rust", "Go", "C"];

  const [url, setURL] = useState("");

  const passURL = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("URL passed:", url);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-between items-center mb-8">
          <a href="/">
            <Image
              src="/favicon.ico"
              alt="PeteCode Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </a>
          <a href="/dashboard">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Dashboard
            </Button>
          </a>
          <div className="space-x-2">
            <Button
              variant="ghost"
              size="medium"
              className="text-gray-400 hover:text-white"
            >
              <HomeIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg space-y-6">
          <div className="relative w-full h-20 overflow-hidden rounded-md">
            <Image
              src="/petecodetext.png"
              alt="PeteCode Logo"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
            {/* <h2 className="text-3xl font-bold">PeteCode</h2> */}
          </div>
          <form onSubmit={passURL} className="space-y-5">
            <Input
              type="text"
              placeholder="Enter LeetCode URL"
              value={url}
              onChange={(e) => setURL(e.target.value)}
              className="flex-grow bg-[#1c1f26] border-[#2e323a] text-white placeholder-gray-400"
            />
            <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
              <SelectTrigger className="w-[120px] bg-[#1c1f26] border-[#2e323a] text-purple-400">
                <SelectValue placeholder={selectedLanguage} />
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectTrigger>
              <SelectContent className="bg-[#1c1f26] border-[#2e323a]">
                {languages.map((lang) => (
                  <SelectItem
                    key={lang}
                    value={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className="text-white hover:bg-[#2e323a]"
                  >
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-between items-center">
              <a href="/answer">
                <Button className="w-full bg-[#4caf50] hover:bg-[#45a049] text-white">
                  Solve
                </Button>
              </a>
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="medium"
                  className="text-gray-400 hover:text-white"
                >
                  <GithubIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="medium"
                  className="text-gray-400 hover:text-white"
                >
                  <MailIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-4 space-x-4">
        <a href="/create">
          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-3 py-2 rounded-lg"
          >
            Sign Up
          </Button>
        </a>
        <a href="/login">
          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-3 py-2 rounded-lg"
          >
            Log In
          </Button>
        </a>
      </div>
    </div>
  );
}
