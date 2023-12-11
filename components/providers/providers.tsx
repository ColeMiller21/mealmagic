"use client";
import { AuthDialogProvider } from "./auth-dialog-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthDialogProvider>{children}</AuthDialogProvider>
    </ThemeProvider>
  );
}
