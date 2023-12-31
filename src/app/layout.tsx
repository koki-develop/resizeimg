import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resize Image",
  description: "JPEG/PNG 画像をリサイズするツールです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <main className="p-8">{children}</main>

        <footer className="flex flex-col items-center justify-center text-sm text-gray-500 p-8 gap-2">
          <span>&copy; koki sato</span>
          <a
            href="https://github.com/koki-develop/resizeimg"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
