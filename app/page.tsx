import { MealPlanGenerate } from "@/components/meal-plan-generate";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-2 max-w-[900px]">
      <h1 className="font-extrabold text-5xl md:text-7xl">
        Meal{" "}
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Magic
        </span>
      </h1>
      <p className="text-center w-full text-xs md:text-base">
        Please enter your macro-nutrient preferences, including protein,
        carbohydrates, and fats, as well as your total calorie intake{" "}
        <strong>for a single day</strong> and any specific dietary types. After
        completing the form, click on "Generate Meal Plan." This action will use
        the information you've provided to create a personalized meal plan that
        aligns with your specified details.
      </p>
      <MealPlanGenerate />
    </main>
  );
}
