import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AuthUserProvider from "./auth/AuthUserContext";
import BackDropProvider from "./pages/HomePage/component/backDrop/BackDropContext";
import SnackBarProvider from "./containers/SnackBars/SnackBarContext";

import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { ReferenceProvider } from "./database/ReferenceContext";
import { FormStateProvider } from "./database/FormStateContext";
import { SearchInfoProvider } from "./pages/SearchPage/SearchInfoContext";
import MarkDownContextProvider from "./pages/NotePage/MarkDownEditor/MarkDownContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthUserProvider>
        <ReferenceProvider>
          <SnackBarProvider>
            <BackDropProvider>
              <FormStateProvider>
                <SearchInfoProvider>
                  <MarkDownContextProvider>
                    <App />
                  </MarkDownContextProvider>
                </SearchInfoProvider>
              </FormStateProvider>
            </BackDropProvider>
          </SnackBarProvider>
        </ReferenceProvider>
      </AuthUserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
