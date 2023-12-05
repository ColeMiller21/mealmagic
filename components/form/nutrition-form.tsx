"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { DietTypes } from "@/data/diet-types";
import { Icons } from "../icons";
import { useDialog } from "../providers/dialog-provider";

const formSchema = z.object({
  protein: z
    .string()
    .transform((value) => parseFloat(value))
    .refine((value) => !isNaN(value) && value > 0 && value <= 1000, {
      message: "Protein must be between 0 and 1000",
    }),
  carbs: z
    .string()
    .transform((value) => parseFloat(value))
    .refine((value) => !isNaN(value) && value > 0 && value <= 1000, {
      message: "Carbs must be between 0 and 1000",
    }),
  fats: z
    .string()
    .transform((value) => parseFloat(value))
    .refine((value) => !isNaN(value) && value > 0 && value <= 1000, {
      message: "Fats must be between 0 and 1000",
    }),
  calories: z
    .string()
    .transform((value) => parseFloat(value))
    .refine((value) => !isNaN(value) && value >= 0 && value <= 10000, {
      message: "Calories must be between 0 and 10000",
    }),
  dietType: z.string(),
});

export function NutritionForm({
  onSubmit,
  prompting,
}: {
  onSubmit: (values: any) => Promise<void>;
  prompting: boolean;
}) {
  let { toggleSubOnlyDialog } = useDialog();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      protein: 0,
      carbs: 0,
      fats: 0,
      calories: 0,
      dietType: DietTypes[0],
    },
  });

  const handleFilter = () => {
    // If a user has the PRO account then they will see dialog to add filters to meal plan.
    toggleSubOnlyDialog();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-3">
          <FormField
            control={form.control}
            name="protein"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protein (grams)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carbs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carbs (grams)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fats (grams)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calories</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dietType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diet Restrictions</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DietTypes.map((d: string, i: number) => {
                        return (
                          <SelectItem key={`${d}-${i}`} value={d}>
                            {d}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-end w-full">
            <Button
              variant={"outline"}
              className="flex items-center gap-2 w-full"
              type="button"
              onClick={handleFilter}
            >
              <Icons.filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>
        {prompting ? (
          <Button className="flex items-center gap-2" disabled>
            <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
            Generating Meal Plan
          </Button>
        ) : (
          <Button type="submit">Generate Meal Plan</Button>
        )}
      </form>
    </Form>
  );
}
