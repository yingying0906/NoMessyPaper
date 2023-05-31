import "./NotePage.css";

import * as React from "react";
import { useParams } from "react-router-dom";

import { Document, Page } from "react-pdf";
import { getFileUrl } from "../../database/controlDatabase";

import { AuthUserContext } from "../../auth/AuthUserContext";
import { ReferenceContext } from "../../database/ReferenceContext";

import { Grid } from "@mui/material";

const NotePage = () => {
  const [pdfURL, setPdfURL] = React.useState(null);
  const { authUser } = React.useContext(AuthUserContext);
  const { references } = React.useContext(ReferenceContext);

  const { noteId } = useParams();
  console.log("noteId: ", noteId);

  React.useEffect(() => {
    if (authUser === null) return;
    const note = references.find((ref) => ref.id === noteId);
    if (note !== undefined) {
      getFileUrl(authUser.uid, noteId, note.fileName).then((url) => {
        setPdfURL(url);
      });
    }

    console.log("pdfURL: ", pdfURL);
  }, [noteId]);

  return (
    <div>
      <h1>123</h1>
      <Grid container spacing={1}>
        {pdfURL && (
          <Grid item xs={6}>
            <object
              style={{ height: "85vh" }}
              data={pdfURL}
              type="application/pdf"
              width="100%"
              height="600px"
            >
              <p>
                Your web browser doesn't have a PDF plugin. Instead, you can{" "}
                <a href={pdfURL}>click here to download the PDF file.</a>
              </p>
            </object>
          </Grid>
        )}

        <Grid item xs={12}>
          1234444444444444444
        </Grid>
      </Grid>
    </div>
  );
};

export default NotePage;
