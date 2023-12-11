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

const constructMacrosPrompt = () => {
  //   Given the following user information, calculate the recommended daily calorie intake and macronutrient distribution for fitness goals:
  // - Age: 30
  // - Gender: Male
  // - Height: 180 cm
  // - Current Weight: 80 kg
  // - Fitness Goal: Weight loss
  // - Target Weight: 75 kg
  // - Activity Level: Moderately active (Jogging 30 minutes daily, weight training 3 times a week)
  // - Dietary Restrictions: Lactose intolerant
  // - Health Conditions: None
  // - Previous Diet Experience: Moderate success with high-protein diets
  // - Daily Routine: 9-5 office job, mostly sedentary
  // - Sleep Pattern: 7 hours per night
  // - Stress Level: Moderate
  // - Body Fat Percentage: 25%
  // - Meal Frequency Preference: Several small meals throughout the day
  // Please provide a calculation of the daily caloric needs based on the Harris-Benedict equation and suggest a macronutrient split for weight loss (percentage of calories from carbohydrates, proteins, and fats).
};

export const constructNewIngredientPrompt = (
  ingredient: {
    name: string;
    amount: number | string;
  },
  meal: any
) => {
  const prompt = `Can you find a 3-5 replacements for ${ingredient.amount} of ${
    ingredient.name
  } in this meal = ${JSON.stringify(
    meal
  )} (which is a stringified json object) and provide a list of five food alternatives with a similar macronutrient profile and a variety of types of food if possible.
  


                  Please return the response is in this structure:
                  [
                    { name: [string], amount: [string]},
                    ...
                  ]
                  
                  Respond only with the completed JSON object, without any additional explanatory or descriptive text. The JSON should be complete and ready for parsing.`;
  return prompt;
};

const constructRecipe = () => {
  //   Breakfast
  // Calories: 500 kcal
  // Macros: 45g protein - 55g carbs - 10g fat
  // 100g Tempeh
  // 2 slices Sourdough Bread
  // 1/4 cup Cottage Cheese
  // 1 cup Spinach
  // Plan object!
  // Based on these exact ingredients and amounts unless it contains 0 calories what are some meals you could make? Could you generate 2 different ideas
};
