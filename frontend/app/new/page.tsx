"use client";

import LeftSidebar from "@/components/left";
import { useSearchParams } from "next/navigation";
import NewSession from "@/components/newSession";
import Session from "@/components/session";

export default function Page() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const sessionId = tab?.startsWith("session/")
    ? tab.split("session/")[1]
    : null;

  return (
    <div className="flex">
      <LeftSidebar />
      <div className="flex-1">
        {(tab === "newSession" || !tab) && <NewSession />}
        {sessionId && <Session sessionId={sessionId} />}
      </div>
    </div>
  );
}
