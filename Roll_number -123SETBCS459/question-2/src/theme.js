import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#005f73",
    },
    secondary: {
      main: "#ee9b00",
    },
    background: {
      default: "#f4f8fb",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
});
