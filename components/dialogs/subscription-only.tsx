"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useDialog } from "../providers/dialog-provider";
import Link from "next/link";

export function GetSubscriptionDialog() {
  let { isSubOnlyDialogOpen, toggleSubOnlyDialog } = useDialog();
  return (
    <Dialog open={isSubOnlyDialogOpen} onOpenChange={toggleSubOnlyDialog}>
      <DialogContent className="w-full flex flex-col  items-center gap-8">
        <h1 className="text-3xl font-extrabold">
          Join Meal
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Magic
          </span>
        </h1>
        <div className="flex flex-col items-center gap-4">
          <p className="text-center">
            By signing up and subscribing for a MealMagic account, you will be
            able to:
          </p>
          <ul className="list-disc list-inside font-bold">
            <li>Save meal plans</li>
            <li>Regenerate meals</li>
            <li>Add more dietary restrictions and preferences</li>
            <li>Get recipes for the meals recommended</li>
          </ul>
        </div>
        <div className="w-full flex flex-col ">
          <div className="w-full flex gap-6">
            <Button variant={"outline"} className="w-full">
              Not Now
            </Button>
            <Button className="w-full">Sign Up</Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?
            <Link
              className="underline ml-2 hover:font-bold duration-150 transition-all"
              href="#"
            >
              Login
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
