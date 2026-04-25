import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Hivon Blog | AI-Powered Platform",
  description: "A premium blogging platform with AI-generated summaries and robust role-based access.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
