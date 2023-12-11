"use client";
import { Dispatch, SetStateAction, useState, useCallback } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { useAuthDialog } from "./providers/auth-dialog-provider";
import {
  parseMealPlanResponse,
  constructSingleMealPrompt,
  constructNewIngredientPrompt,
} from "@/lib/prompt-fns";

import { useCompletion } from "ai/react";

export function MealPlanDisplay({
  mealPlan,
  setMealPlan,
}: {
  mealPlan: any;
  setMealPlan: Dispatch<SetStateAction<any>>;
}) {
  if (!mealPlan) return null;
  let { breakfast, lunch, dinner, snacks } = mealPlan;
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
  let { toggleSubOnlyDialog, toggleUpgradeDialog } = useAuthDialog();
  const [selectedIngredientIndex, setSelectedIngredientIndex] = useState<
    number | null
  >(null);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [generatingOptions, setGeneratingOptions] = useState<boolean>(false);
  const [showReplaceView, setShowReplaceView] = useState<boolean>(false);
  const [selectedReplacementIndex, setSelectedReplacementIndex] = useState<
    number | null
  >(null);
  const { complete, isLoading } = useCompletion({
    api: "/prompt",
  });

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
    regenerate(values);
    // toggleUpgradeDialog();
    // toggleSubOnlyDialog();
  };

  const regenerate = useCallback(
    async (values: any) => {
      let prompt = constructSingleMealPrompt(values);
      const completion = await complete(prompt);
      if (!completion) throw new Error("Failed to get meal plan. Try again.");
      const result = parseMealPlanResponse(completion);
      let lowerCaseMealType = values.mealType.toLowerCase();
      let capitalizedMealType =
        lowerCaseMealType.charAt(0).toUpperCase() + lowerCaseMealType.slice(1);
      const mealData = result[capitalizedMealType];
      setMealPlan((prevMealPlan: any) => {
        return {
          ...prevMealPlan,
          [lowerCaseMealType]: mealData,
        };
      });
    },
    [complete]
  );

  const generateNewIngredientOptions = useCallback(
    async (selectedIndex: number) => {
      setGeneratingOptions(true);
      toggleScreen();
      let ingredient = plan.ingredients[selectedIndex];

      let prompt = constructNewIngredientPrompt(ingredient, plan);

      const completion = await complete(prompt);
      if (!completion) {
        setGeneratingOptions(false);
        throw new Error("Failed to get meal plan. Try again.");
      }
      const result = parseMealPlanResponse(completion);
      setGeneratingOptions(false);
      setIngredientOptions(result);
    },
    [complete]
  );

  const toggleScreen = () => {
    setShowReplaceView(!showReplaceView);
  };

  const resetSelections = () => {
    setShowReplaceView(false);
    setSelectedIngredientIndex(null);
    setSelectedReplacementIndex(null);
    setIngredientOptions([]);
  };

  const replaceIngredient = () => {
    plan.ingredients[selectedIngredientIndex as number] =
      ingredientOptions[selectedReplacementIndex as number];

    setMealPlan((prevMealPlan: any) => {
      return {
        ...prevMealPlan,
        [type]: plan,
      };
    });
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
            (
              ingredient: { name: string; amount: number | string },
              i: number
            ) => {
              return (
                <li key={`${ingredient}-${i}`} className="list-none">
                  {ingredient.amount} {ingredient.name}
                </li>
              );
            }
          )}
        </ul>
      </div>
      <div className="flex items-start gap-2">
        <Dialog
          onOpenChange={(e) => {
            if (!e) resetSelections();
          }}
        >
          <DialogTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Icons.crosshair className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Inspect</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTrigger>
          <DialogContent>
            {!showReplaceView ? (
              <div id="meal-view">
                <div className="flex flex-col items-center w-full">
                  <h3 className="text-lg font-semibold">{type}</h3>
                  <p className="text-sm font-bold text-muted-foreground">
                    Calories: {plan?.calories} kcal
                  </p>
                  <p className="text-sm font-bold text-muted-foreground">
                    Macros: {plan?.macros.protein}g protein -{" "}
                    {plan?.macros.carbs}g carbs - {plan?.macros.fats}g fat
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center my-2">
                  <p className="italic text-sm">
                    Select an ingredient below to find alternatives.
                  </p>
                  {plan?.ingredients.map(
                    (
                      ingredient: { name: string; amount: number | string },
                      i: number
                    ) => {
                      return (
                        <Button
                          key={`${ingredient}-${i}`}
                          variant={
                            selectedIngredientIndex === i ? "default" : "ghost"
                          }
                          className="list-none flex gap-2 items-center"
                          onClick={() => setSelectedIngredientIndex(i)}
                        >
                          <span>
                            {ingredient.amount} {ingredient.name}
                          </span>
                        </Button>
                      );
                    }
                  )}
                </div>
                <div className="w-full flex">
                  <Button
                    className="w-full"
                    disabled={selectedIngredientIndex !== null ? false : true}
                    onClick={() =>
                      generateNewIngredientOptions(
                        selectedIngredientIndex as number
                      )
                    }
                  >
                    Find alternatives
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full bg-red min-h-full">
                {generatingOptions && (
                  <div className="flex flex-col items-center justify-center">
                    <Icons.loader className="w-8 h-8 animate-spin" />
                    <span className="text-sm italic">
                      Searching for alternatives...
                    </span>
                  </div>
                )}
                {ingredientOptions.length > 0 && (
                  <div className="w-full flex flex-col gap-3 items-center">
                    <h6 className="font-bold">
                      Alternatives for{" "}
                      {
                        plan?.ingredients[selectedIngredientIndex as number]
                          ?.amount
                      }{" "}
                      {
                        plan?.ingredients[selectedIngredientIndex as number]
                          ?.name
                      }
                    </h6>
                    {ingredientOptions.map(
                      (
                        option: { name: string; amount: string | number },
                        i: number
                      ) => {
                        return (
                          <Button
                            key={i}
                            variant={
                              selectedReplacementIndex === i
                                ? "default"
                                : "outline"
                            }
                            onClick={() => setSelectedReplacementIndex(i)}
                          >
                            {option.name} {option.amount}
                          </Button>
                        );
                      }
                    )}
                    <div className="w-full flex gap-4">
                      <Button
                        className="w-full"
                        variant={"outline"}
                        onClick={() => resetSelections()}
                      >
                        Back to meal
                      </Button>

                      <DialogClose asChild>
                        <Button
                          className="w-full"
                          disabled={
                            selectedReplacementIndex !== null ? false : true
                          }
                          onClick={() => replaceIngredient()}
                        >
                          Replace
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {isLoading ? (
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
