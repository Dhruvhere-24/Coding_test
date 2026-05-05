import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "../src/theme";
import "./globals.css";

export const metadata = {
  title: "Campus Notifications",
  description: "Assessment frontend for campus notifications",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
