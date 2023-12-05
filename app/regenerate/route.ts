import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

type RegenerateFormValues = {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  dietType: string;
  mealType: string;
};

export async function POST(request: Request) {
  const response = await request.json();
  const values = response.values as RegenerateFormValues;
  let prompt = constructSingleMealPrompt(values);
  console.log({ prompt });
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a knowledgeable nutritionist, skilled in creating personalized meal plans.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  return NextResponse.json({
    message: "Successful Get",
    promptResponse: chatCompletion,
  });
}

function constructSingleMealPrompt(values: any) {
  let dietTypeDescription = !values.dietType ? "" : `${values.dietType} `;
  return `Can you create a ${dietTypeDescription}${values.mealType.toLowerCase()} meal for me based on these details and return it in JSON format? The details are: Macros for this meal: ${
    values.protein
  } grams of protein, ${values.carbs} grams of carbs, ${
    values.fats
  } grams of fats; Meal Calories: ${values.calories}. 
          The JSON object should have the following structure:
          {
            "${values.mealType}": {
              "calories": [number of calories for the ${values.mealType} meal],
              "macros": {"protein": [amount in grams], "fats": [amount in grams], "carbs": [amount in grams]},
              "ingredients": [
                {"name": [ingredient name], "amount": [amount of the ingredient]},
                ...
              ],
              dietType: [kind of diet type if applicable] on each meal object (if no diet type is in prompt you can set this as null)
            }
          }
          Please ensure that the macros and calorie count are appropriate for the ${
            values.mealType
          } meal.`;
}
