"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, User, PanelLeft, Trash2, LogOut } from "lucide-react";
import Logo from "./logo";
import axios from "axios";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAuth } from "@/hooks/useAuth";

interface Session {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
}

export default function LeftSidebar() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  
  const { signout } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/sessions", {
          withCredentials: true,
        });
        setSessions(response.data.data);
      } catch (error) {
        console.error(
          "Failed to fetch sessions:",
          error?.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleDelete = async (sessionId: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/sessions/${sessionId}`, {
        withCredentials: true,
      });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      console.error("Delete failed:", err?.response?.data || err.message);
    }
  };

  return (
    <aside
      className={cn(
        "h-screen bg-[#212121] text-white flex flex-col justify-between border-r border-r-[0.5px] border-r-gray-700 transition-all duration-300",
        isOpen ? "w-64 p-4" : "w-16 items-center py-4"
      )}>
      {/* Top Section */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex text-xl font-bold w-full justify-center">
          {isOpen ? (
            <div className="flex justify-between items-center w-full">
              <Logo />
              <PanelLeft
                size={20}
                className="cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
              />
            </div>
          ) : (
            <PanelLeft
              size={20}
              className="cursor-pointer"
              onClick={() => setIsOpen((prev) => !prev)}
            />
          )}
        </div>

        <Button
          variant="secondary"
          className="w-full flex items-center gap-1"
          onClick={() => {
            router.push(`/new?tab=newSession`);
          }}>
          <Plus size={18} />
          {isOpen && <span>New Session</span>}
        </Button>

        {isOpen && (
          <div className="w-full mt-6 space-y-2">
            <div className="font-light">Sessions</div>

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sessions</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between w-full gap-2">
                  <Button
                    variant="default"
                    className="flex-1 justify-start text-left truncate bg-[#212121] hover:bg-[#303030]"
                    onClick={() => {
                      router.push(`/new?tab=session/${session.id}`);
                    }}>
                    {session.title || "Untitled"}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/10 hover:text-red-400"
                    onClick={() => handleDelete(session.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-center mb-4 w-full">
        {isOpen ? (
          <div className="flex items-center justify-between w-full px-2">
            <span className="text-sm truncate">{userName || "Guest"}</span>
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500 hover:bg-red-800/10"
              onClick={() => {
                signout;
              }}>
              <LogOut size={18} />
            </Button>
          </div>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white text-sm font-medium">
            {userName?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>
    </aside>
  );
}
