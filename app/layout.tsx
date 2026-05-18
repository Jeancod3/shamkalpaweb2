import Navbar from "../components/layout/Navbar";
import type { Metadata } from "next";
import { Cinzel, Manrope } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["500", "700"]
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "Shamkalpa | Bienestar Holístico",
  description: "Centro holístico, prácticas espirituales y tienda online CBD."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
  <Navbar />
  {children}
</body>
    </html>
  );
}
