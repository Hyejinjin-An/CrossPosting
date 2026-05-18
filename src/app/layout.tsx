import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "CrossPosting — 크로스포스팅",
  description:
    "Instagram 게시물을 가져와 채널별 초안을 만들고, 공식 API로 발행하거나 수동 게시 플로우로 마무리하세요.",
  icons: {
    icon: "/brand/logo.svg",
  },
  openGraph: {
    title: "CrossPosting",
    description: "SNS 게시물 재사용 워크스페이스",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
