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
