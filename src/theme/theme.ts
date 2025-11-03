import { createTheme } from "@mui/material/styles";

const baseFontStack =
  'var(--font-inter), "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif';
const headingFontStack =
  'var(--font-sora), "Sora", "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#15949A",
      dark: "#0B6E73",
      light: "#45B2B7",
    },
    secondary: {
      main: "#F98C5B",
      dark: "#D86C39",
      light: "#FDB28C",
    },
    background: {
      default: "#F5F2EB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0B2333",
      secondary: "#354252",
    },
    divider: "rgba(11, 35, 51, 0.12)",
  },
  typography: {
    fontFamily: baseFontStack,
    h1: {
      fontFamily: headingFontStack,
      fontWeight: 600,
      fontSize: "3.5rem",
      lineHeight: 1.1,
      letterSpacing: "-0.04em",
    },
    h2: {
      fontFamily: headingFontStack,
      fontWeight: 600,
      fontSize: "2.75rem",
      lineHeight: 1.2,
      letterSpacing: "-0.03em",
    },
    h3: {
      fontFamily: headingFontStack,
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.25,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontFamily: headingFontStack,
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.3,
    },
    body1: {
      fontSize: "1.125rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
      textTransform: "none",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.875rem",
      fontWeight: 500,
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F5F2EB",
          color: "#0B2333",
        },
        "*": {
          boxSizing: "border-box",
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "lg",
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: "1.75rem",
          paddingBlock: "0.75rem",
        },
        containedSecondary: {
          color: "#0B2333",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: "-0.01em",
        },
      },
    },
  },
});

export default theme;
