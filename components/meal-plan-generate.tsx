"use client";
import { useState, useCallback } from "react";
import { useChat } from "ai/react";
import { MealPlanDisplay } from "./meal-plan-display";
import { NutritionForm } from "./form/nutrition-form";
import {
  triggerPrompt,
  parseMealPlanResponse,
  constructPrompt,
} from "@/lib/prompt-fns";

import { useCompletion } from "ai/react";
import { parse } from "path";

export function MealPlanGenerate() {
  const [prompting, setPrompting] = useState<boolean>(false);
  const [mealPlan, setMealPlan] = useState(null);

  const { completion, complete, stop, isLoading } = useCompletion({
    api: "/test-route",
  });

  // async function onSubmit(values: any) {
  //   try {
  //     // let response = await triggerPrompt(values);
  //     // if (!response.ok) {
  //     //   throw new Error(`HTTP error! status: ${response.status}`);
  //     // }
  //     // setPrompting(false);
  //     // const data = await response.json();
  //     // let mealPlan = data.promptResponse.choices[0].message.content;
  //     // let parsedMealPlan = parseMealPlanResponse(mealPlan);
  //     // console.log("got meal plan: ", parsedMealPlan);
  //     // setMealPlan(parsedMealPlan);
  //     let prompt = constructPrompt(values);
  //     handleSubmit(prompt)
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  const onSubmit = useCallback(
    async (values: any) => {
      let c = constructPrompt(values);
      const completion = await complete(c);
      if (!completion) throw new Error("Failed to get meal plan. Try again.");
      console.log({ completion });
      const result = parseMealPlanResponse(completion);
      console.log(result);
      setMealPlan(result);
    },
    [complete]
  );

  return (
    <div className="flex flex-col gap-4 mb-12">
      <NutritionForm onSubmit={onSubmit} prompting={isLoading} />
      {mealPlan && (
        <>
          <MealPlanDisplay mealPlan={mealPlan} setMealPlan={setMealPlan} />
          <SaveMeal />
        </>
      )}
    </div>
  );
}

const SaveMeal = () => {
  return (
    <div className="w-full mx-auto">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative px-7 py-6 bg-background ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-center space-x-6 cursor-pointer font-extrabold uppercase">
          Save Meal
        </div>
      </div>
    </div>
  );
};
