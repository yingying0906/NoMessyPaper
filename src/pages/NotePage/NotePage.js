import "./NotePage.css";

import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { getFileUrl, updateMindmap } from "../../database/controlDatabase";

import { AuthUserContext } from "../../auth/AuthUserContext";
import { ReferenceContext } from "../../database/ReferenceContext";
import { SnackBarContext } from "../../containers/SnackBars/SnackBarContext";
import controlContext from "./contexts/control-context";

import { Grid } from "@mui/material";
import PdfViewer from "./PdfViewer/PdfViewer";

import NoteBord from "./NoteBord";

const NotePage = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const { noteId } = useParams();
  const { authUser } = React.useContext(AuthUserContext);
  const { references } = React.useContext(ReferenceContext);

  useEffect(() => {
    if (authUser === null) return;
    const note = references.find((ref) => ref.id === noteId);
    if (note !== undefined) {
      getFileUrl(authUser.uid, noteId, note.fileName)
        .then((url) => {
          setPdfUrl(url);
        })
        .catch((err) => {
          console.log("no pdf");
        });
    }
  }, [authUser, noteId, references]);

  return (
    <div>
      <h1>NotePage</h1>
      <div style={{ height: "80vh" }}>
        <Grid container spacing={1} sx={{ height: "100%" }}>
          {pdfUrl && (
            <Grid item xs={6}>
              <PdfViewer pdfUrl={pdfUrl} />
            </Grid>
          )}

          <Grid item xs={pdfUrl ? 6 : 12}>
            {/* WORKSPACE */}
            <NoteBord className="note-space" />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default NotePage;
