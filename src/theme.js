// themes.js

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff", // Replace with your primary color
    },
    secondary: {
      main: "#ff6f61", // Replace with your secondary color
    },
    background: {
      default: "#f0f0f0",
    },
  },
  typography: {
    fontFamily: "Poppins-Regular !important",
  },
});

export default theme;
