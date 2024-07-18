"use client"
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import CustomNavbar from "./nav/nav";
import Ban from "./Banner/ban";
import Footer from "./Others/Footer";
import "./Others/Style.css"
import Chatbot from "./Bot/page";

export default function RootLayout({ children }) {
  return (
    <>
    <CustomNavbar></CustomNavbar>
    {/* <Ban></Ban> */}
    {children}
    <Chatbot></Chatbot>
    <Footer></Footer>
    </>
  );
}
