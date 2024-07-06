"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
const inter = Inter({ subsets: ["latin"] });
import { Provider } from "react-redux";
import { Storee } from "@/Store";

export default function RootLayout({ children }) {
  return (
    <Provider store={Storee}>
    <html lang="en">
      <GoogleOAuthProvider clientId='166424008698-umf0iijpbmf0he2qdg70ebpbjhv9ol4b.apps.googleusercontent.com'>
      <body className={inter.className}>{children}</body>
      </GoogleOAuthProvider>
    </html>
    </Provider>
  );
}
