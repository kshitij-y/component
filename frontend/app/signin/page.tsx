"use client";

import Logo from "@/components/logo";
import SignInPage from "@/components/Signin";

export default function LoginPage() {
    return (
      <div className="flex flex-col bg-[#212121] h-screen">
        <div className="flex justify-center items-center m-10">
          <Logo />
        </div>
            <div>
                <SignInPage />
            </div>
      </div>
    );
}
