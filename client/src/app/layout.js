import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SnapTix | Real-Time Concurrency-Safe Seat Booking",
  description:
    "Production-grade live seat booking platform guaranteeing zero double-booking under high concurrent load with instant WebSocket synchronization.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-[#1F2533] text-slate-100 flex flex-col selection:bg-[#F84464] selection:text-white">
        {children}
      </body>
    </html>
  );
}
