import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Caption Generator AI",
  description: "Buat caption media sosial yang engaging dengan AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
