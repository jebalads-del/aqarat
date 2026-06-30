import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "عقارات - منصة العقارات العربية",
  description: "منصة عقارات شاملة باللغة العربية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
