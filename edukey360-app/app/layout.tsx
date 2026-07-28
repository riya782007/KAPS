import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme";
import { AppShell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Edukey360 OS — AI Recruitment Operating System",
  description: "The single operating system that runs educational recruitment — sourcing, AI screening, verification, interviews and reporting, automatically. By NEWVORA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600;700&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@500,600,700,800,900&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🎓%3C/text%3E%3C/svg%3E" />
      </head>
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
