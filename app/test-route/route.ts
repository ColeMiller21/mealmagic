import { NextResponse } from "next/server";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export const runtime = "edge";

type RegenerateFormValues = {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  dietType: string;
  mealType: string;
};

export async function POST(request: Request) {
  console.log("TRIGGER PROMPT HANDLER");
  const { prompt } = await request.json();
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
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
    temperature: 0.1,
    top_p: 1,
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
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
