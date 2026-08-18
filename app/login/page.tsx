"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="bg-background grid min-h-screen md:grid-cols-2">
      <div className="from-primary via-primary to-accent relative hidden overflow-hidden bg-gradient-to-br md:flex md:flex-col md:justify-between md:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_15%,#000_40%,transparent_100%)] bg-[size:36px_36px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-white/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -bottom-32 size-[28rem] rounded-full bg-black/10 blur-3xl"
        />

        <div className="relative flex size-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
          <span className="size-2.5 rounded-full bg-white" />
        </div>

        <div className="relative flex flex-col gap-3 text-white">
          <h1 className="text-4xl font-semibold tracking-tight">
            Internal Tools
          </h1>
          <p className="max-w-sm text-base text-white/70">
            Sign in with your company credentials to access the internal
            dashboard.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="from-primary to-primary/70 shadow-primary/30 mb-6 flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg md:hidden">
            <span className="bg-primary-foreground size-2.5 rounded-full" />
          </div>

          <h2 className="text-foreground text-2xl font-semibold tracking-tight">
            Sign in
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Enter your username and password to continue.
          </p>

          <form
            className="mt-8 flex flex-col gap-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="yourusername"
                  required
                  className="h-10 pl-8"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="h-10 pr-9 pl-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex w-9 items-center justify-center"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="shadow-primary/20 mt-1 h-10 w-full shadow-md"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
