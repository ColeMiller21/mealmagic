"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [selected, setSelected] = useState("M");

  return (
    <section className="w-full  px-4 lg:px-8 py-12 lg:py-24 relative overflow-hidden">
      <Heading selected={selected} setSelected={setSelected} />
      <PriceCards selected={selected} />
      <TopLeftCircle />
      <BottomRightCircle />
    </section>
  );
}

const Heading = ({}: {
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="mb-6 lg:mb-12 relative z-10">
      <h3 className="font-extrabold text-5xl lg:text-7xl text-center mb-6">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Account
        </span>{" "}
        Plans
      </h3>
      <p className="text-center mx-auto max-w-lg mb-8">
        Select from the below plans to get started with extra Magic Meal perks.
        If you sign up with <strong>FREE</strong> account you will always have
        the ability to upgrade!
      </p>
    </div>
  );
};

const PriceCards = ({ selected }: { selected: string }) => (
  <div className="flex flex-col lg:flex-row lg:justify-center gap-8 lg:gap-4 w-full max-w-6xl mx-auto relative z-10">
    {/* FREE */}
    <div className="w-full p-6 border-[1px] border-slate-300 rounded-xl max-w-[350px] flex flex-col min-h-[450px]">
      <p className="text-3xl font-extrabold mb-2">FREE</p>
      <p className="text-lg mb-6">Everything to start</p>
      <p className="text-6xl font-bold mb-8">
        $0<span className="font-normal text-xl">/yearly</span>
      </p>

      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Icons.check className="h-6 w-6" />
          <span className="text-base">Save generated plans</span>
        </div>
      </div>

      <Button className="w-full py-4 mt-8 font-semibold rounded-lg uppercase h-[55px]">
        Sign up free
      </Button>
    </div>

    {/* PRO  */}
    <div className="w-full p-6 border-[1px] border-slate-300 rounded-xl max-w-[350px] flex flex-col min-h-[450px]">
      <p className="text-3xl font-extrabold mb-2">PRO</p>
      <p className="text-lg mb-6">Everything to start</p>
      <p className="text-6xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        $20<span className="font-normal text-xl text-primary">/yearly</span>
      </p>

      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Icons.check className="h-6 w-6" />
          <span className="text-base">Save generated plans</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Icons.check className="h-6 w-6" />
          <span className="text-base">Regenerate meals</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Icons.check className="h-6 w-6" />
          <span className="text-base">
            Add preferences and additional filters
          </span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Icons.check className="h-6 w-6" />
          <span className="text-base">Get recipes for generated meals</span>
        </div>
      </div>

      <Button className="w-full py-4 mt-8 font-semibold rounded-lg uppercase h-[55px] bg-gradient-to-r from-purple-400 to-pink-600 text-white">
        Sign up pro
      </Button>
    </div>
  </div>
);

const TopLeftCircle = () => {
  return (
    <motion.div
      initial={{ rotate: "0deg" }}
      animate={{ rotate: "360deg" }}
      transition={{ duration: 100, ease: "linear", repeat: Infinity }}
      className="w-[450px] h-[450px] rounded-full border-2 border-muted-foreground border-dotted absolute z-0 -left-[250px] -top-[200px]"
    />
  );
};

const BottomRightCircle = () => {
  return (
    <motion.div
      initial={{ rotate: "0deg" }}
      animate={{ rotate: "-360deg" }}
      transition={{ duration: 100, ease: "linear", repeat: Infinity }}
      className="w-[450px] h-[450px] rounded-full border-2 border-muted-foreground border-dotted absolute z-0 -right-[250px] -bottom-[200px]"
    />
  );
};
