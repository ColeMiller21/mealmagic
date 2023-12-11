"use client";

import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useAuthDialog } from "./providers/auth-dialog-provider";
import Link from "next/link";
export function Navbar() {
  let { toggleLoginDialog } = useAuthDialog();
  let STUB_LOGIN = false;
  return (
    <nav className="w-full flex items-center justify-between py-3 px-2">
      <div>
        <Link href="/" className="cursor-pointer">
          <span className="font-extrabold text-2xl">
            M
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              M
            </span>
          </span>
        </Link>
      </div>
      <div className="flex gap-3">
        {STUB_LOGIN ? (
          <Button className="bg-gradient-to-r from-purple-400 to-pink-600 text-white font-extrabold hover:scale-105 duration-200 transition-transform">
            PRO
          </Button>
        ) : (
          <Button onClick={toggleLoginDialog}>Log In</Button>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
