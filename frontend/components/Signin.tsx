"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import GoogleAuth from "./google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function SignInPage() {
  const { signin, loading,signinWithGoogle, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await signin({ email, password });
  };

  const handleLoginSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    const decoded: any = jwtDecode(token);
    console.log("Decoded:", decoded);
    await signinWithGoogle(token);
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="bg-[#303030] border-none text-white w-[350px] shadow-lg">
        <CardContent className=" flex flex-col w-full gap-4 py-6">
          <h2 className="text-2xl font-bold text-center">Welcome back</h2>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log("Login Failed")}
              theme="filled_black"
              size="large"
              width="302"
              text="continue_with"
              shape="rectangular"
            />

          <div className="text-center text-gray-400 text-sm">or</div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="Email"
              className="bg-[#2c2c2c] text-white border border-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              className="bg-[#2c2c2c] text-white border border-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
              disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {error && (
            <p className="text-red-500 text-sm text-center mt-1">{error}</p>
          )}

          <p className="text-gray-400 text-sm text-center">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-indigo-400 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
