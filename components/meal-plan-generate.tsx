"use client";
import { useState, useCallback } from "react";
import { MealPlanDisplay } from "./meal-plan-display";
import { NutritionForm } from "./form/nutrition-form";
import { parseMealPlanResponse, constructPrompt } from "@/lib/prompt-fns";

import { useCompletion } from "ai/react";

export function MealPlanGenerate() {
  const [mealPlan, setMealPlan] = useState(null);

  const { complete, isLoading } = useCompletion({
    api: "/prompt",
  });
  const onSubmit = useCallback(
    async (values: any) => {
      let c = constructPrompt(values);
      const completion = await complete(c);
      if (!completion) throw new Error("Failed to get meal plan. Try again.");
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
