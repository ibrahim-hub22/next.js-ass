"use client";
//@ts-ignore:allow side-effect CSS import without type declarations
import"./globals.css";
import { Geist, Geist_Mono } from "next/font/google";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient]=useState(()=> new QueryClient());

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        
      </body>
    </html>
  );
}
