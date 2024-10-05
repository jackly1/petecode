"use client";

import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { HomeIcon } from "lucide-react";

const cardsData = [
  { thumbnail: "/petecodetext.png", title: "Pete Code Text" },
  { thumbnail: "/", title: "Card Title 2" },
  { thumbnail: "/", title: "Card Title 3" },
  { thumbnail: "/", title: "Card Title 4" },
  { thumbnail: "/", title: "Card Title 5" },
  // Add more card data as needed
];

export default function Component() {
<<<<<<< HEAD
  const [problems, setProblems] = useState<ProblemData[]>([]); // State to store problems from the backend
  const [loading, setLoading] = useState(true); // State to manage loading status

  // Function to fetch problems from FastAPI
  const fetchProblems = async () => {
    try {
        //  add in a path to the database retrieval here
      const response = await fetch("http://localhost:8000/.../", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: "https://leetcode.com/problems/two-sum/", // Example problem URL
          language: "python", // Example language
        }),
      });

      const data = await response.json();

      // Assuming the data is in the structure { title, url, code, audio_files }
      setProblems([data]); // Set the response data into the state
      setLoading(false); // Set loading to false
    } catch (error) {
      console.error("Error fetching problem data:", error);
      setLoading(false);
    }
  };

  // useEffect to fetch problems when the component mounts
  useEffect(() => {
    fetchProblems(); // Call fetch function on component mount
  }, []); // Empty dependency array to run only once

=======
>>>>>>> a237b9f (Video doesnt' load)
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
          <a href="/">
            <Button variant="ghost" className="text-white">
              <div className="pl-[131px]">
                <HomeIcon className="lh-5 w-5" />
              </div>
            </Button>
          </a>
        </div>
        <div className="flex space-x-2">
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

      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cardsData.map((card, index) => (
            <a href="/answer" key={index}>
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <Image
                  src="/favicon.ico"
                  alt="PeteCode Logo"
                  layout="responsive"
                  width={500}
                  height={128}
                  className="object-contain w-full h-32"
                />
                <h3 className="text-white text-lg font-semibold mt-2">
                  {card.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
