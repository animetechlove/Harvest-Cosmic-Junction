import type { Metadata } from "next";
import "./globals.css";
import RotatePrompt from "@/components/RotatePrompt";

export const metadata: Metadata = {
  title: "Harvest Cosmic Junction",
  description: "Inkstone Co. Interactive Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
          <body className="antialiased bg-black min-h-screen m-0 p-0 overflow-x-hidden">
        <RotatePrompt />
        {children}
      </body>  
    </html>
  );
}