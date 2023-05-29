import "./SearchPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";

import FetchPaperFromGoogleScholar from "./FetchPaperFromGoogleScholar";
import ControlPanel from "./ControlPanel";
import { Alert, Button, Container, TextField } from "@mui/material";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { LoadingButton } from "@mui/lab";

import { Link } from "react-router-dom";
import { AuthUserContext } from "../../auth/AuthUserContext";
import serpapi_logo from "../../assets/serpapi_logo.png";

// 開兩個terminal
// 一個terminal 需要先單獨運行server.js =>  node server.js
// 另一個terminal => npm start

const SearchPage = () => {
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState("");
  const [keywords, setKeywords] = useState("");

  const [fromYear, setFromYear] = useState("");
  const [searchFromYear, setSearchFromYear] = useState("");

  const [toYear, setToYear] = useState("");
  const [searchToYear, setSearchToYear] = useState("");

  const [numOfResults, setNumOfResults] = useState("10");
  const [searchNumOfResults, setSearchNumOfResults] = useState("10");

  const { apiKey } = React.useContext(AuthUserContext);

  useEffect(() => {
    const savedText = sessionStorage.getItem("keywords");
    if (savedText) {
      setText(savedText);
      setKeywords(savedText);
    }
  }, []);

  function inputChange(e) {
    setText(e.target.value);
  }

  function startSearch() {
    if (text !== "") {
      setKeywords(text);
      setSearchFromYear(fromYear);
      setSearchToYear(toYear);
      setSearchNumOfResults(numOfResults);
      setLoading(true);

      sessionStorage.setItem("keywords", text);
      sessionStorage.setItem("fromYear", fromYear);
      sessionStorage.setItem("toYear", toYear);
      sessionStorage.setItem("numOfResults", numOfResults);
    }
  }

  return (
    <Container fixed style={{ padding: "2vw" }}>
      {apiKey === "" && (
        <Alert severity="error">
          You need to provide your SerpApi API key in the{" "}
          <Link to="/Account">Account Page</Link>
        </Alert>
      )}

      <Grid2 container spacing={3} sx={{ marginBottom: "5px" }}>
        <Grid2 xs={3} sx={{ justifyContent: "center", alignSelf: "center" }}>
          <Button style={{ fontSize: "0.8em" }}>
            Search features powered by{" "}
            <a
              href="https://serpapi.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img style={{ height: "40px" }} src={serpapi_logo} alt="logo" />
            </a>
          </Button>
        </Grid2>
        <Grid2 xs={7} sx={{ justifyContent: "center", alignSelf: "center" }}>
          <TextField
            fullWidth
            id="demo-helper-text-misaligned-no-helper"
            label="You Only Have 100 Searches per month"
            value={text}
            onChange={inputChange}
          />
        </Grid2>
        <Grid2 xs={2} sx={{ justifyContent: "center", alignSelf: "center" }}>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={startSearch}
            loading={loading}
            loadingPosition="start"
            startIcon={<FindInPageOutlinedIcon />}
          >
            Search
          </LoadingButton>
        </Grid2>
      </Grid2>
      {!keywords && (
        <div style={{ fontSize: "50px" }} className="center">
          Start Search
        </div>
      )}
      {keywords && (
        <Grid2 container justifyContent="center" style={{ marginTop: "20px" }}>
          <Grid2 xs>
            <ControlPanel
              setFromYear={setFromYear}
              setToYear={setToYear}
              setNumOfResults={setNumOfResults}
            />
          </Grid2>
          <Grid2 xs={8}>
            <FetchPaperFromGoogleScholar
              setLoading={setLoading}
              searchKeyword={keywords}
              setSearchFromYear={searchFromYear}
              searchToYear={searchToYear}
              searchNumOfResults={searchNumOfResults}
            />
          </Grid2>
        </Grid2>
      )}
    </Container>
  );
};

export default SearchPage;
