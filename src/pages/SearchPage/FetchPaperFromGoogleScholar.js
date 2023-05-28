import {
  AppBar,
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

const FetchPaperFromGoogleScholar = ({
  setLoading,
  searchKeyword,
  setSearchFromYear,
  searchToYear,
  searchNumOfResults,
}) => {
  const [paperData, setPaperData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // if want to search paper => use this  因為只能搜尋 100次/月 ， api_key=可以切換成自己的api_key (；´ﾟωﾟ｀人)
        const response = await fetch(
          `/paper/search.json?engine=google_scholar&q=${searchKeyword}&hl=en&as_ylo=${setSearchFromYear}&as_yhi=${searchToYear}&num=${searchNumOfResults}&api_key=40ec1a6eed3621a8e92723e97d5ddf679d0de9afab41679a8e1c93dd3038c724`
        ).then((response) => response.json());

        // if 使用已有的json檔 => use this
        // const response = await fetch("http://localhost:3001/paper")
        //     .then(response => response.json())

        // 會有以下問題 => No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
        // const response = await fetch("https://serpapi.com/searches/bb6e2fcc452dcb5b/6464ec487f8361e3061a9c72.json", { mode: 'cors' })
        //     .then(response => response.json())

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

  function saveData(data) {
    console.log(data);
    // console.log(data.title) // title
    // console.log(data.publication_info.authors) // authors

    // year 和 journal 不知道怎麼找... _:(´□`」 ∠):_
  }

  return (
    <Container sx={{ marginTop: "10px" }}>
      <AppBar
        position="static"
        sx={{ borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }}
      >
        <Typography variant="h4" sx={{ margin: "10px" }}>
          Search " {searchKeyword} " Results
        </Typography>
      </AppBar>
      <Grid sx={{ overflowY: "auto", maxHeight: "72vh" }}>
        {paperData &&
          paperData.map((data, index) => {
            return (
              <Paper
                elevation={3}
                sx={{ margin: "10px", marginBottom: "20px" }}
                key={index}
              >
                <Typography variant="h5" sx={{ margin: "5px" }}>
                  <Link href={data.link} underline="none">
                    {data.title}
                  </Link>
                </Typography>
                <Typography variant="subtitle1">
                  {data.publication_info.summary}
                </Typography>

                {data.resources && (
                  <Link href={data.resources[0].link}>
                    <Button
                      variant="outlined"
                      sx={{ margin: "10px", marginBottom: "15px" }}
                      startIcon={<InsertLinkOutlinedIcon />}
                    >
                      PDF Link
                    </Button>
                  </Link>
                )}

                {
                  <Button
                    variant="outlined"
                    sx={{ margin: "10px", marginBottom: "15px" }}
                    onClick={() => saveData(data)}
                    startIcon={<SaveAsRoundedIcon />}
                  >
                    console.log information
                  </Button>
                }
              </Paper>
            );
          })}
      </Grid>
    </Container>
  );
};

export default FetchPaperFromGoogleScholar;
