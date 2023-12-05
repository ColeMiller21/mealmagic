"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDialog } from "./providers/dialog-provider";
import {
  triggerRegeneratePrompt,
  parseMealPlanResponse,
} from "@/lib/prompt-fns";

export function MealPlanDisplay({
  mealPlan,
  setMealPlan,
}: {
  mealPlan: any;
  setMealPlan: Dispatch<SetStateAction<any>>;
}) {
  if (!mealPlan) return null;
  let { breakfast, lunch, dinner, snacks } = mealPlan;
  console.log(breakfast);
  return (
    <section className="w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col space-y-4 md:space-y-6 lg:space-y-8">
        <MealSectionDisplay
          type="Breakfast"
          plan={breakfast}
          setMealPlan={setMealPlan}
        />
        <MealSectionDisplay
          type="Lunch"
          plan={lunch}
          setMealPlan={setMealPlan}
        />
        <MealSectionDisplay
          type="Dinner"
          plan={dinner}
          setMealPlan={setMealPlan}
        />
        <MealSectionDisplay
          type="Snacks"
          plan={snacks}
          setMealPlan={setMealPlan}
        />
      </div>
    </section>
  );
}

const displayIcon = (type: string) => {
  let icon;
  switch (type.toLowerCase()) {
    case "breakfast":
      icon = <Icons.coffee className="h-6 w-6 " />;
      break;
    case "lunch":
      icon = <Icons.sandwich className="h-6 w-6 " />;
      break;
    case "dinner":
      icon = <Icons.utensils className="h-6 w-6 " />;
      break;
    case "snacks":
      icon = <Icons.popcorn className="h-6 w-6 " />;
      break;
  }
  return icon;
};

const MealSectionDisplay = ({
  plan,
  type,
  setMealPlan,
}: {
  plan: any;
  type: string;
  setMealPlan: Dispatch<SetStateAction<any>>;
}) => {
  let { toggleSubOnlyDialog, toggleUpgradeDialog } = useDialog();
  const [regenerating, setRegenerating] = useState<boolean>(false);

  let STUB_LOGIN = true;

  const handleRegnerateMeal = async (plan: any, type: string) => {
    // If user is subscribed - PRO - they will be able to regenerate
    // If user is subscirbed as - FREE - they will be prompted with the upgrade dialog
    // If user is not logged in trigger Sub Dialog

    let values = {
      ...plan.macros,
      calories: plan.calories,
      dietType: plan.dietType,
      mealType: type,
    };
    console.log({ values });
    regenerate(values);
    // toggleUpgradeDialog();
    if (STUB_LOGIN) {
      return;
    }
    // toggleSubOnlyDialog();
  };

  const regenerate = async (values: any) => {
    try {
      setRegenerating(true);
      console.log("prompting single meal");
      let response = await triggerRegeneratePrompt(values);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setRegenerating(false);
      const data = await response.json();
      let mealPlan = data.promptResponse.choices[0].message.content;
      let parsedMealPlan = parseMealPlanResponse(mealPlan);
      console.log("got single meal plan: ", parsedMealPlan);
      let lowerCaseMealType = values.mealType.toLowerCase();
      let capitalizedMealType =
        lowerCaseMealType.charAt(0).toUpperCase() + lowerCaseMealType.slice(1);
      const mealData = parsedMealPlan[capitalizedMealType];
      setMealPlan((prevMealPlan: any) => {
        return {
          ...prevMealPlan,
          [lowerCaseMealType]: mealData,
        };
      });
    } catch (err) {
      console.error(err);
      setRegenerating(false);
    }
  };

  return (
    <div className="flex space-x-4 items-start">
      {displayIcon(type)}
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{type}</h3>
        <p className="text-sm font-bold text-muted-foreground">
          Calories: {plan?.calories} kcal
        </p>
        <p className="text-sm font-bold text-muted-foreground">
          Macros: {plan?.macros.protein}g protein - {plan?.macros.carbs}g carbs
          - {plan?.macros.fats}g fat
        </p>

        <ul className=" mt-2">
          {plan?.ingredients.map(
            (ingredient: { name: string; amount: number }, i: number) => {
              return (
                <li key={`${ingredient}-${i}`} className="list-none">
                  {ingredient.amount} {ingredient.name}
                </li>
              );
            }
          )}
        </ul>
      </div>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {regenerating ? (
                <Button variant="outline" disabled size="icon">
                  <Icons.loader className="h-4 w-4 animate-spin" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRegnerateMeal(plan, type)}
                >
                  <Icons.reset className="h-4 w-4" />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>Regenerate</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
