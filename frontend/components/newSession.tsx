"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./logo";
import axios from "axios";

export default function NewSession() {
  const apiUrl = process.env.NEXT_PUBLIC_API;
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleCreate = async () => {
    if (!title.trim()) return;

    try {
      const response = await axios.post(
        `${apiUrl}/api/sessions`,
        { title },
        { withCredentials: true }
      );

      const newId = response.data.data?.id;

      if (newId) {
        router.push(`new/?tab=session/${newId}`);
      } else {
        console.error("No session ID returned");
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-[#212121] px-6 h-fit">
      <div className="mb-16">
        <Logo />
      </div>

      <h1 className="text-3xl font-semibold text-white mb-6 text-center max-w-md">
        Create your new session to start chatting with AI
      </h1>

      <input
        type="text"
        placeholder="Enter session title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full max-w-md rounded-md bg-[#2a2a2a] text-white placeholder-gray-400 px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500 transition"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCreate();
        }}
      />

      <button
        onClick={handleCreate}
        disabled={!title.trim()}
        className="mt-8 w-full max-w-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-md font-semibold transition">
        Create Session
      </button>
    </div>
  );
}
