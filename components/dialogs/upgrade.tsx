"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useAuthDialog } from "../providers/auth-dialog-provider";

export function UpgradeDialog() {
  let { isUpgradeDialogOpen, toggleUpgradeDialog } = useAuthDialog();
  return (
    <Dialog open={isUpgradeDialogOpen} onOpenChange={toggleUpgradeDialog}>
      <DialogContent className="w-full flex flex-col  items-center gap-8">
        <h1 className="text-3xl font-extrabold">
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Upgrade
          </span>{" "}
          Magic Meal
        </h1>
        <div className="flex flex-col items-center gap-4">
          <p className="text-center">
            This is a <strong>PRO</strong> only feature. By choosing to upgrade
            you will get access to the following features.
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
            <Button className="w-full py-4 mt-8 font-extrabold text-lg rounded-lg uppercase h-[55px] bg-gradient-to-r from-purple-400 to-pink-600 text-white">
              UPGRADE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
