import {
  Backdrop,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import SaveAsRoundedIcon from "@mui/icons-material/SaveAsRounded";
import { AuthUserContext } from "../../auth/AuthUserContext";
import AddSearchBackDrop from "./AddSearchPaper/AddSearchBackDrop";
import { FormStateContext } from "../../database/FormStateContext.js";
const FetchPaperFromGoogleScholar = ({
  setLoading,
  searchKeyword,
  setSearchFromYear,
  searchToYear,
  searchNumOfResults,
}) => {
  const [paperData, setPaperData] = useState(null);

  const { apiKey } = React.useContext(AuthUserContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // if want to search paper => use this  因為只能搜尋 100次/月 ， api_key=可以切換成自己的api_key (；´ﾟωﾟ｀人)
        /* const response = await fetch(`https://no-messy-paper.netlify.app/.netlify/functions/proxy/paper/search.json?engine=google_scholar&q=${searchKeyword}&hl=en&as_ylo=${setSearchFromYear}&as_yhi=${searchToYear}&num=${searchNumOfResults}&api_key=40ec1a6eed3621a8e92723e97d5ddf679d0de9afab41679a8e1c93dd3038c724`).then((response) => response.json()); */

        /*         // via api key (by po ying)
        const response = await fetch(
          `http://localhost:3001/paper/search.json?engine=google_scholar&q=${searchKeyword}&hl=en&as_ylo=${setSearchFromYear}&as_yhi=${searchToYear}&num=${searchNumOfResults}&api_key=${apiKey}`
        ).then((response) => response.json()); */

        // if 使用已有的json檔 => use this
        const response = await fetch("http://localhost:3001/paper").then(
          (response) => response.json()
        );

        // 會有以下問題 => No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
        /*         const response = await fetch(
          "https://serpapi.com/searches/bb6e2fcc452dcb5b/6464ec487f8361e3061a9c72.json",
          { mode: "cors" }
        ).then((response) => response.json()); */

        setPaperData([...response.organic_results]);
      } catch (error) {
        console.error("Error fetching paper data:", error);
      }
    };
    fetchData();
  }, [searchKeyword, setSearchFromYear, searchToYear, searchNumOfResults]);

  useEffect(() => {
    setLoading(false);
  }, [paperData]);

  // add reference
  const { formState, setFormState } = React.useContext(FormStateContext);
  const [paperLink, setPaperLink] = useState("");

  async function saveData(data, index) {
    console.log(data);
    // ensure authors exist
    const parts = data.publication_info.summary.split(" - ");

    const authors = parts[0];
    // the publication year may be the 0 element

    const part_2 = parts[1].trim().split(", ");
    const publicationYear = part_2[part_2.length - 1];
    const publication = parts[1].replace(", " + publicationYear, "");

    if (paperData[index].resources) {
      console.log(paperData[index].resources[0]?.link);
      // Wait for the asynchronous operation to complete
      const paperLink = paperData[index].resources[0]?.link || "";
      await setPaperLink(paperLink);
    } else {
      await setPaperLink("");
    }

    const ref = {
      author: authors,
      title: data.title,
      year: publicationYear,
      journal: publication,
      tags: "",
      selectedFile: null,
      link: data.link,
    };
    setFormState(ref);

    setOpenBackDrop(true);
  }
  /* backdrop */
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const handleBackDropClose = () => {
    setOpenBackDrop(false);
  };

  return (
    <>
      <Container>
        <div
          style={{
            borderRadius: "10px",
            border: "1px solid #526D8230",
            overflow: "clip",
          }}
        >
          <div
            position="static"
            style={{
              backgroundColor: "#526D82",
              padding: "5px",
            }}
          >
            <Typography variant="h6">
              Search " {searchKeyword} " Results
            </Typography>
          </div>
          <Grid sx={{ overflowY: "auto", maxHeight: "72vh" }}>
            {paperData &&
              paperData.map((data, index) => {
                return (
                  <Paper
                    elevation={3}
                    sx={{
                      margin: "20px 10px",
                      textAlign: "left",
                      padding: "10px",
                    }}
                    key={index}
                  >
                    <Typography variant="h6" sx={{ margin: "0" }}>
                      <Link href={data.link} underline="none">
                        {data.title}
                      </Link>
                    </Typography>
                    <Typography variant="subtitle1">
                      {data.publication_info.summary}
                    </Typography>

                    {data.resources && (
                      <Link href={data.resources[0].link} target="_blank">
                        <Button
                          variant="outlined"
                          sx={{ margin: "5px 5px" }}
                          startIcon={<InsertLinkOutlinedIcon />}
                        >
                          PDF Link
                        </Button>
                      </Link>
                    )}

                    {
                      <Button
                        variant="outlined"
                        sx={{ margin: "5px 5px" }}
                        onClick={() => saveData(data, index)}
                        startIcon={<SaveAsRoundedIcon />}
                      >
                        SAVE TO LIBRARY
                      </Button>
                    }
                  </Paper>
                );
              })}
          </Grid>
        </div>
      </Container>

      <Backdrop
        sx={{ color: "black", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackDrop}
        onClick={handleBackDropClose}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <AddSearchBackDrop
            handleBackDropClose={handleBackDropClose}
            paperLink={paperLink}
          />
        </div>
      </Backdrop>
    </>
  );
};

export default FetchPaperFromGoogleScholar;
