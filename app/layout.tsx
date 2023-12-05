import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { GetSubscriptionDialog } from "@/components/dialogs/subscription-only";
import { Navbar } from "@/components/navbar";
import { LoginDialog } from "@/components/dialogs/login";
import { UpgradeDialog } from "@/components/dialogs/upgrade";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Meal Magic",
  description: "AI Generated Meal Plans",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen min-w-screen bg-background font-sans antialiased flex justify-center",
          fontSans.variable
        )}
      >
        <Providers>
          <div className="w-screen flex flex-col max-w-[1400px] items-center">
            <Navbar />
            {children}
          </div>
          <GetSubscriptionDialog />
          <LoginDialog />
          <UpgradeDialog />
        </Providers>
      </body>
    </html>
  );
}
