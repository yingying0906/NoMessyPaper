import "./App.css";
import { Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import NavBar from "./containers/NavBar/NavBar";
import IntroPage from "./pages/IntroPage/IntroPage";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import AddRefPage from "./pages/AddRefPage/AddRefPage";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#526D82",
      },
      secondary: {
        main: "#9DB2BF",
      },
      background: {
        main: "#DDE6ED",
      },
    },
    typography: {
      h6: {
        "&": {
          color: "white",
          opacity: 0.7,
        },

        "&:hover": {
          color: "white",
          opacity: 1,
          transition: "color 0.3s ease",
        },
      },
      // Add more styles for other typography variants if needed
    },
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <NavBar />
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Add" element={<AddRefPage />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
