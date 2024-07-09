"use client"
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import PersistentDrawerLeft from "./nav/nav";

export default function RootLayout({ children }) {
  return (
    <>
    <PersistentDrawerLeft></PersistentDrawerLeft>
    {children}
    </>
  );
}
