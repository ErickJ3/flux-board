"use client";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/redux/store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const store = makeStore();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider store={store}>
        <body className={inter.className}>{children}</body>
      </Provider>
    </html>
  );
}
