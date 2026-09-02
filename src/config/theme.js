import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#007cc2",
      light: "#35b7ee",
      dark: "#006ca9",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6871d9",
      light: "#8f97eb",
      dark: "#4f57c2",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f6f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#161b2f",
      secondary: "#697386",
    },
    error: {
      main: "#e25348",
      light: "#ffe9e4",
    },
    warning: {
      main: "#e18a00",
      light: "#fff3dc",
    },
    info: {
      main: "#007cc2",
      light: "#e6f7ff",
    },
    success: {
      main: "#17aa55",
      light: "#ddf8e8",
    },
  },
  typography: {
    fontFamily: [
      '"Plus Jakarta Sans"',
      '"Segoe UI"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontSize: "1.75rem", fontWeight: 800 },
    h2: { fontSize: "1.5rem", fontWeight: 800 },
    h3: { fontSize: "1.25rem", fontWeight: 700 },
    h4: { fontSize: "1.125rem", fontWeight: 700 },
    h5: { fontSize: "1rem", fontWeight: 700 },
    h6: { fontSize: "0.875rem", fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 124, 194, 0.18)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
