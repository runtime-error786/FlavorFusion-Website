"use client"
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import CustomNavbar from "./nav/nav";
import Ban from "./Banner/ban";

export default function RootLayout({ children }) {
  return (
    <>
    <CustomNavbar></CustomNavbar>
    {/* <Ban></Ban> */}
    {children}
    </>
  );
}
