import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Caption Generator",
  description: "Buat caption media sosial yang engaging dengan AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{ margin: 0 }}>
        {children}
        <div id="ad-container" style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px 0 24px",
          background: "#f8f7ff"
        }}>
          <div style={{ width: 300, height: 250 }} />
        </div>
        <Script id="ad-options" strategy="afterInteractive">
          {`
            atOptions = {
              'key' : 'fc8c3829fbbf9f25ec4a0145fdc38195',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          `}
        </Script>
        <Script
          src="https://www.highperformanceformat.com/fc8c3829fbbf9f25ec4a0145fdc38195/invoke.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
