import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { store } from "@/store/store";

import App from "./App";
const defaultTheme = createTheme();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline>
            <App />
            <ToastContainer />
          </CssBaseline>
        </ThemeProvider>
      </Provider>
    </Router>
  </React.StrictMode>
);
