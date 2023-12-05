"use client";
import { useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDialog } from "../providers/dialog-provider";
import { Icons } from "../icons";

export function LoginDialog() {
  let { isLoginDialogOpen, toggleLoginDialog } = useDialog();
  const [email, setEmail] = useState<string>("");
  return (
    <Dialog open={isLoginDialogOpen} onOpenChange={toggleLoginDialog}>
      <DialogContent className="w-full flex flex-col  items-center gap-8">
        <h1 className="text-3xl font-extrabold">
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Login
          </span>
        </h1>
        <p className="text-muted-foreground">
          Please select your method to login
        </p>
        <div className="w-full flex flex-col gap-4 mb-4">
          <Button variant={"outline"} className="flex items-center gap-2">
            <Icons.google className="w-4 h-4" />
            Login With Google
          </Button>
          <Separator />
          <div className="flex flex-col w-full gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />
            <Button className="flex items-center gap-2">
              <Icons.mail className="w-4 h-4" />
              Login With Email
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?
            <Link
              className="underline ml-2 hover:font-bold duration-150 transition-all"
              href="/sign-up"
              onClick={toggleLoginDialog}
            >
              Signup
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
