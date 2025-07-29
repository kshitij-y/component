"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import Logo from "@/components/logo";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/new");
    } else {
      router.replace("/signin");
    }
  }, [isAuthenticated, router]);

  return <div className="flex flex-col bg-[#212121] h-screen">
    <div className="flex justify-center m-10">
      <Logo />
    </div>
    
  </div>;
}
