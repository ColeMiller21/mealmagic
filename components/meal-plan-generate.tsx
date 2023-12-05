"use client";
import { useState } from "react";
import { MealPlanDisplay } from "./meal-plan-display";
import { NutritionForm } from "./form/nutrition-form";
import { triggerPrompt, parseMealPlanResponse } from "@/lib/prompt-fns";

export function MealPlanGenerate() {
  const [prompting, setPrompting] = useState<boolean>(false);
  const [mealPlan, setMealPlan] = useState(null);

  async function onSubmit(values: any) {
    try {
      setPrompting(true);
      let response = await triggerPrompt(values);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setPrompting(false);
      const data = await response.json();
      let mealPlan = data.promptResponse.choices[0].message.content;
      let parsedMealPlan = parseMealPlanResponse(mealPlan);
      console.log("got meal plan: ", parsedMealPlan);
      setMealPlan(parsedMealPlan);
    } catch (err) {
      console.error(err);
      setPrompting(false);
    }
  }
  return (
    <div className="flex flex-col gap-4 mb-12">
      <NutritionForm onSubmit={onSubmit} prompting={prompting} />
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
