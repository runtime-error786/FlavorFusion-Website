"use client"
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import CustomNavbar from "./nav/nav";
export default function RootLayout({ children }) {
  return (
    <>
    <CustomNavbar></CustomNavbar>
    {children}
    </>
  );
}
