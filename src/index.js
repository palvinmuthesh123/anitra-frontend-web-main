import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Provider } from "react-redux";
// Load fonts
import "../src/assets/fonts/Poppins-Regular.ttf";
import "../src/assets/fonts/Poppins-Thin.ttf";
import "../src/assets/fonts/Poppins-Medium.ttf";
import "../src/assets/fonts/Poppins-SemiBold.ttf";
import "../src/assets/fonts/Poppins-Bold.ttf";
import "../src/assets/fonts/Poppins-ExtraBold.ttf";
import "../src/assets/fonts/Poppins-Black.ttf";
import { SnackbarProvider } from "./context/useSnackbar";
import { AppContextProvider } from "./context/AppContext";
import store from "./store";
import { BrowserRouter, useLocation } from "react-router-dom";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <SnackbarProvider>
          <AppContextProvider>
            <Provider store={store}>
              <App />
            </Provider>
          </AppContextProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
