import { Providers } from "../src/components/providers";
import "./globals.css";

export const metadata = {
  title: "Campus Notifications",
  description: "Assessment frontend for campus notifications",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
