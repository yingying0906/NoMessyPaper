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
  const { noteId } = useParams();
  const [pdfUrl, setPdfUrl] = React.useState(null);
  const { authUser } = React.useContext(AuthUserContext);
  const { references, mindmaps } = React.useContext(ReferenceContext);
  const { setShapes, setShapesmap, setAnchor } =
    React.useContext(controlContext);

  console.log("noteId: ", noteId);

  React.useEffect(() => {
    // get pdf url
    if (authUser === null) return;
    const note = references.find((ref) => ref.id === noteId);
    if (note !== undefined && note !== null) {
      getFileUrl(authUser.uid, noteId, note.fileName)
        .then((url) => {
          setPdfUrl(url);
        })
        .catch((err) => {
          console.log("url erro", err);
          setPdfUrl(null);
        });
    }

    console.log("pdfURL: ", pdfUrl);

    // get mindmap info
    const mindmapNow = mindmaps.find((mindmap) => mindmap.id === noteId);
    console.log("mindmapNow: ", mindmapNow);

    if (mindmapNow === undefined || mindmapNow === null) {
      setShapes([]);
      setShapesmap({});
      setAnchor(null);
    } else {
      setShapes(mindmapNow.shapes);
      setShapesmap(mindmapNow.shapesMap);
      setAnchor(mindmapNow.anchorPoint);
    }
  }, []);

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
