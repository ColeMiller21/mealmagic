type NutritionFormValues = {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  dietType: string;
};

type RegenerateFormValues = {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  dietType: string;
  mealType: string;
};

export const triggerPrompt = async (values: any) => {
  const response: any = await fetch("/prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  });
  return response;
};

export const triggerRegeneratePrompt = async (values: any) => {
  const response: any = await fetch("/regenerate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  });
  return response;
};

export const parseMealPlanResponse = (response: string) => {
  console.log({ response });
  if (response.includes("json")) {
    const jsonStart = response.indexOf("```json\n{");
    const jsonEnd = response.lastIndexOf("}\n```") + 1;
    const jsonString = response.substring(jsonStart + 8, jsonEnd);
    return JSON.parse(jsonString);
  }
  return JSON.parse(response);
};

export const constructPrompt = (values: NutritionFormValues) => {
  let dietTypeDescription =
    values.dietType === "None" ? "null" : `"${values.dietType}"`;

  return `Create a JSON object for a meal plan tailored to ${dietTypeDescription} diet type. The plan should meet these overall daily nutritional goals: ${values.protein} grams of protein, ${values.carbs} grams of carbs, ${values.fats} grams of fats, and a total of ${values.calories} calories.

The JSON object must include four keys: "breakfast", "lunch", "dinner", and "snacks". Each key will map to a meal object containing the following fields:
- "calories": [number],
- "macros": {"protein": [number], "fats": [number], "carbs": [number]},
- "ingredients": [{"name": [string], "amount": [string]}, ...],
- "dietType": [string or null] (based on the provided diet type).

Ensure that the sum of the calories and macros in all meals aligns with the daily nutritional goals. Format the response as a valid JSON object with all fields filled. Here is the structure for reference:

{
  "breakfast": { /* details */ },
  "lunch": { /* details */ },
  "dinner": { /* details */ },
  "snacks": { /* details */ }
}

Respond only with the completed JSON object, without any additional explanatory or descriptive text. The JSON should be complete and ready for parsing.`;
};

export const constructSingleMealPrompt = (values: any) => {
  let dietTypeDescription = values.dietType ? `${values.dietType} ` : "";
  let mealTypeLowercase = values.mealType.toLowerCase();

  return `Can you create a ${dietTypeDescription}${mealTypeLowercase} meal that fits these nutritional goals and return it in JSON format? The meal should have ${
    values.protein
  } grams of protein, ${values.carbs} grams of carbs, and ${
    values.fats
  } grams of fats. The total calories for this meal should be around ${
    values.calories
  }.

Please format the meal plan as a JSON object with this structure:
{
  "${values.mealType}": {
    "calories": [exact number of calories for the ${mealTypeLowercase} meal],
    "macros": {
      "protein": [exact amount in grams],
      "fats": [exact amount in grams],
      "carbs": [exact amount in grams]
    },
    "ingredients": [
      {"name": [ingredient name], "amount": [amount of the ingredient]},
      ...
    ],
    "dietType": "${values.dietType || "null"}"
  }
}

The macros and calorie count should be accurately represented for the specified ${mealTypeLowercase} meal.`;
};
