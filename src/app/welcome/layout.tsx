"use client";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Suspense fallback={<>Loading...</>}>{children}</Suspense>;
}
