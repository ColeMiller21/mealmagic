import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export const runtime = "edge";

type NutritionFormValues = {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  dietType: string;
};

export async function POST(request: Request) {
  const response = await request.json();
  const values = response.values as NutritionFormValues;
  let prompt = constructPrompt(values);
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

function constructPrompt(values: NutritionFormValues) {
  let dietTypeDescription =
    values.dietType === "None" ? "" : `for a ${values.dietType} diet type`;
  return `Can you create a  meal plan ${dietTypeDescription} based on these details and return it in JSON format? The details are: Overall Macros: ${values.protein} grams of protein, ${values.carbs} grams of carbs, ${values.fats} grams of fats; Total Daily Calories: ${values.calories}. 
          Please structure each meal (breakfast, lunch, dinner, and snacks) as a key in the returned JSON object. Each meal should be an object with the following structure:
          {
            "calories": [number of calories],
            "macros": {"protein": [amount in grams], "fats": [amount in grams], "carbs": [amount in grams]},
            "ingredients": [
              {"name": [ingredient name], "amount": [amount of the ingredient and measurement]},
              ...
            ],
            dietType: [kind of diet type if applicable] on each meal object (if no diet type is in prompt you can set this as null)
          }
          Please ensure that the macros and calorie count align with the overall daily goals.`;
}
