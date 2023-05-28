import "./SearchPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";

import FetchPaperFromGoogleScholar from "./FetchPaperFromGoogleScholar";
import ControlPanel from "./ControlPanel";
import { Button, Container, TextField } from "@mui/material";
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { LoadingButton } from "@mui/lab";

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

  useEffect(() => {
    const savedText = sessionStorage.getItem("keywords");
    if (savedText) {
      setText(savedText);
      setKeywords(savedText);
    }
  }, []);

  function goHome() {
    setText("");
    setKeywords("");
    setFromYear("");
    setToYear("");
    setNumOfResults("10");
    sessionStorage.setItem("keywords", "");
    sessionStorage.setItem("fromYear", "");
    sessionStorage.setItem("toYear", "");
    sessionStorage.setItem("numOfResults", "");
  }

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
    <Container fixed>
      <Grid2 container spacing={3} sx={{ marginTop: "10px", marginBottom: "5px" }}>
        <Grid2 xs={3} sx={{ justifyContent: "center", alignSelf: "center" }}>
          <Button variant='text' onClick={goHome}>Search Page</Button>
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
            variant='contained'
            color='primary'
            onClick={startSearch}
            loading={loading}
            loadingPosition="start"
            startIcon={<FindInPageOutlinedIcon />}>
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
        <Grid2 container justifyContent="center">
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
