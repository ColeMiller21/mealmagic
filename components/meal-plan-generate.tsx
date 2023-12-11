"use client";
import { useState, useCallback } from "react";
import { Button } from "./ui/button";
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
      setMealPlan(result);
    },
    [complete]
  );

  const savePlan = () => {
    let savedPlans = JSON.parse(localStorage.getItem("savedMeals") || "[]");
    if (savedPlans.length === 5) {
      alert("Max amount of saved plans for your plan.");
      return;
    }
    savedPlans.push(mealPlan);
    localStorage.setItem("savedMeals", JSON.stringify(savedPlans));
  };

  return (
    <div className="flex flex-col gap-4 mb-12">
      <NutritionForm onSubmit={onSubmit} prompting={isLoading} />
      {mealPlan && (
        <>
          {/* <SaveMeal savePlan={savePlan} /> */}
          <MealPlanDisplay mealPlan={mealPlan} setMealPlan={setMealPlan} />
        </>
      )}
    </div>
  );
}

const SaveMeal = ({ savePlan }: { savePlan: () => void }) => {
  const originalText = "Save Meal Plan";

  const [savedButtonText, setSavedButtonText] = useState<string>(originalText);

  return (
    // <div className="w-full mx-auto">
    //   <div className="relative group">
    //     <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
    //     <div className="relative px-7 py-6 bg-background ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-center space-x-6 cursor-pointer font-extrabold uppercase">
    //       Save Meal
    //     </div>
    //   </div>
    // </div>
    <div className="w-full flex justify-end">
      <Button
        className="bg-green-500 text-white px-4 py-2 rounded-md"
        variant="outline"
        onClick={() => {
          savePlan();
          setTimeout(() => {
            setSavedButtonText("Saved!");
          }, 1000);
        }}
      >
        {savedButtonText}
      </Button>
    </div>
  );
};
