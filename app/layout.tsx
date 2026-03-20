import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Caption Generator",
  description: "Buat caption media sosial yang engaging dengan AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{ margin: 0 }}>
        {children}
        <div style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px 0 24px",
          background: "#f8f7ff"
        }}>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                atOptions = {
                  'key' : 'fc8c3829fbbf9f25ec4a0145fdc38195',
                  'format' : 'iframe',
                  'height' : 250,
                  'width' : 300,
                  'params' : {}
                };
              `
            }}
          />
          <script src="https://www.highperformanceformat.com/fc8c3829fbbf9f25ec4a0145fdc38195/invoke.js" />
        </div>
      </body>
    </html>
  );
}
