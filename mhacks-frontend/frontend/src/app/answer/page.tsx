"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { HomeIcon, Play } from "lucide-react";
import { Button } from "../../../components/ui/button";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-python";

const CodeSnippet = ({ code }: { code: string }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <pre className="w-full h-full">
      <code ref={codeRef} className="language-python w-full h-full">
        {code}
      </code>
    </pre>
  );
};

const Component = () => {
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchData = async () => {
    const url = searchParams.get("url");
    const language = searchParams.get("language");

    if (!url || !language) {
      setError("Missing URL or language parameter");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/generate-audio/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, language }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setCode(data.code);
      setAudioFiles(data.audio_files);
      setIsLoading(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  useEffect(() => {
    const playAudios = async () => {
      for (let i = 0; i < audioFiles.length; i++) {
        setCurrentAudioIndex(i);
        await new Promise<void>((resolve) => {
          if (audioRef.current) {
            audioRef.current.src = `http://localhost:8080${audioFiles[i]}`;
            audioRef.current.onended = () => resolve();
            audioRef.current.oncanplaythrough = () => {
              audioRef.current?.play().catch((e) => {
                console.error("Audio playback failed:", e);
                resolve();
              });
            };
            audioRef.current.load();
          } else {
            resolve();
          }
        });
      }
    };

    if (audioFiles.length > 0) {
      playAudios();
    }
  }, [audioFiles]);

  const playAudio = () => {
    if (audioRef.current && audioFiles.length > 0) {
      audioRef.current.src = `http://localhost:8080${audioFiles[currentAudioIndex]}`;
      audioRef.current
        .play()
        .catch((e) => console.error("Audio playback failed:", e));
    }
  };
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-sign-login-orange"></div>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
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
              <a href="/">
                <HomeIcon className="lh-5 w-5" />
              </a>
            </div>
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

      <main
        className="flex-grow flex flex-col items-center justify-center p-12"
        style={{ backgroundColor: "#0E1117" }}
      >
        <div className="flex flex-row items-start justify-center w-full max-w-5xl space-x-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-40 h-40 bg-[#3e3e3e] flex items-center justify-center rounded-full">
              <img
                src="https://media.tenor.com/HgDBJdnGh2MAAAAM/peter-griffin-yapping.gif"
                alt="Peter Griffin"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-full bg-[#3e3e3e] p-4 rounded-lg">
              <CodeSnippet code={code} />
            </div>
            <div className="mt-4 flex space-x-2">
              <Button
                className="bg-[#4caf50] hover:bg-[#45a049] px-2"
                onClick={playAudio}
              >
                Play Audio
              </Button>
              <Button className="bg-[#4caf50] hover:bg-[#45a049] px-2">
                Save Solution
              </Button>
            </div>
          </div>

          <div className="w-96 h-110 rounded-lg relative overflow-hidden">
            <video
              className="w-full h-full rounded-lg pointer-events-none"
              autoPlay
              loop
              muted
              playsInline
              src="https://r6---sn-fvf-in8s.googlevideo.com/videoplayback?expire=1728161353&ei=6VEBZ4zjE6Shir4PrNa0iA4&ip=198.98.59.215&id=o-AGDooWSkTizdpJtsBEotr2o3_VQDBjdkQEyyzJxEifGZ&itag=244&aitags=133,134,135,136,160,242,243,244,247,278,298,299,302,303&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&siu=1&bui=AXLXGFQ8MwoOQs4P_HyvOkY-ZSchwLrEqJGg_X4x08gZOhpErm5SFg1CLIsfr3jbZ0flM2UMkQ&spc=54MbxflF4rDdi3ADQj4Br3UXQ1PYMgfYIbr8X2DNLxY0AwjaLuR93GrIjTKoJ8utFTTktok&vprv=1&svpuc=1&mime=video/webm&ns=K52UM_7srQvQEUPnpuVdWCgQ&rqh=1&gir=yes&clen=16252244&dur=145.367&lmt=1726274319110671&keepalive=yes&fexp=51300761&c=WEB&sefc=1&txp=531A224&n=EwMP_6wqdxNVAg&sparams=expire,ei,ip,id,aitags,source,requiressl,xpc,siu,bui,spc,vprv,svpuc,mime,ns,rqh,gir,clen,dur,lmt&sig=AJfQdSswRQIhAON-spVzXtgOxmJKhwttuSxkpOZnY2L-kgRtahxNWBqFAiA30x9kHD5j-FjfY6iw9Ex94Uqza56eStinjf3DG_heCA%3D%3D&pot=MluiJA-ANwQkvqIcDblC8Ca_Wsms8lylFC078GsQmTvbaTq1lFIKNuzb6ke9MYovAe29lENaupYiJzQ6Ax0iWH6EjVgCQrCWjRyPG5RdMuYLUKx8dMJefKLzCk9e&range=0-&cms_redirect=yes&mh=dF&mip=68.179.129.149&mm=31&mn=sn-fvf-in8s&ms=au&mv=m&mvi=6&pl=19&lsparams=mh,mip,mm,mn,ms,mv,mvi,pl&lsig=ACJ0pHgwRAIgXoC_sqZB3KYiIpxEy13xHUmWV4YsSfp3-CPdfwiRfCACIHghwnD9obtq-UI8QRIZT7puQvN8FR7xwRiMhHawG4aV"
            />
            <div className="absolute inset-0 bg-transparent"></div>
          </div>
        </div>
      </main>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Component;
