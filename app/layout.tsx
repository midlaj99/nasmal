import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { BookingProvider } from "@/context/BookingContext";

export const metadata: Metadata = {
  title: "Nasmal Tourisms | Travel that shapes you",
  description: "Book activities, tours and experiences in UAE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BookingProvider>
          <Navbar />
          {children}
          <Footer />
        </BookingProvider>
      </body>
    </html>
  );
}
