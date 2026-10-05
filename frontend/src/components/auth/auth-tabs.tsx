"use client";

import * as React from "react";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

export function AuthTabs() {
  const [activeTab, setActiveTab] = React.useState<"login" | "signup">("login");

  return (
    <div className="w-full">
      <div className="flex border-b border-[#C89B5E]/20 mb-6">
        <button
          onClick={() => setActiveTab("login")}
          className={`flex-1 py-3 text-sm font-semibold tracking-wide uppercase transition-colors ${
            activeTab === "login"
              ? "text-[#C89B5E] border-b-2 border-[#C89B5E]"
              : "text-[#F5E6D3]/60 hover:text-[#F5E6D3]"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          className={`flex-1 py-3 text-sm font-semibold tracking-wide uppercase transition-colors ${
            activeTab === "signup"
              ? "text-[#C89B5E] border-b-2 border-[#C89B5E]"
              : "text-[#F5E6D3]/60 hover:text-[#F5E6D3]"
          }`}
        >
          Create Account
        </button>
      </div>

      <div>
        {activeTab === "login" ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
}
