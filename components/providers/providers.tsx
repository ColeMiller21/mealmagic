"use client";
import { DialogProvider } from "./dialog-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DialogProvider>{children}</DialogProvider>
    </ThemeProvider>
  );
}
