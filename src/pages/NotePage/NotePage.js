import "./NotePage.css";

import * as React from "react";
import { useParams } from "react-router-dom";

import { Document, Page } from "react-pdf";
import { getFileUrl } from "../../database/controlDatabase";

import { AuthUserContext } from "../../auth/AuthUserContext";
import { ReferenceContext } from "../../database/ReferenceContext";

import { Grid } from "@mui/material";
import PdfViewer from "./PdfViewer/PdfViewer";

const NotePage = () => {
  const [pdfUrl, setPdfUrl] = React.useState(null);
  const { authUser } = React.useContext(AuthUserContext);
  const { references } = React.useContext(ReferenceContext);

  const { noteId } = useParams();
  console.log("noteId: ", noteId);

  React.useEffect(() => {
    if (authUser === null) return;
    const note = references.find((ref) => ref.id === noteId);
    if (note !== undefined) {
      getFileUrl(authUser.uid, noteId, note.fileName).then((url) => {
        setPdfUrl(url);
      });
    }

    console.log("pdfUrl: ", pdfUrl);
  }, [noteId]);

  return (
    <div>
      <h1>NotePage</h1>
      <Grid container spacing={1}>
        {pdfUrl && (
          <Grid item xs={6}>
            <PdfViewer pdfUrl={pdfUrl} />
          </Grid>
        )}

        <Grid item xs={12}>
          WORKSAPCE
        </Grid>
      </Grid>
    </div>
  );
};

export default NotePage;
