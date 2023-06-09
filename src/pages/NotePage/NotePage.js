import "./NotePage.css";

import { Button, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { getFileUrl, updateMindmap } from "../../database/controlDatabase";

import { AuthUserContext } from "../../auth/AuthUserContext";
import { ReferenceContext } from "../../database/ReferenceContext";
import { SnackBarContext } from "../../containers/SnackBars/SnackBarContext";
import ControlContext from "./contexts/control-context";

import { Grid } from "@mui/material";
import PdfViewer from "./PdfViewer/PdfViewer";

import NoteBoard from "./NoteBoard";
import MarkdownEditor from "./MarkDownEditor/MarkDownEditor";
import { MarkDownContext } from "./MarkDownEditor/MarkDownContext";
import NoteButtonGroups from "./NoteButtonGroups/NoteButtonGroups";

const NotePage = () => {
  /* For board */
  // const { setShapes, setShapesmap, setAnchor } =
  //   React.useContext(controlContext);

  /* for pdf */
  const { noteId } = useParams();

  const [pdfUrl, setPdfUrl] = React.useState(null);
  const { authUser } = React.useContext(AuthUserContext);
  const { references, mindmaps, markdownRead } =
    React.useContext(ReferenceContext);
  const {
    shapes,
    shapesMap,
    anchorPoint,
    setShapes,
    setShapesMap,
    setAnchorPoint,
    resetState,
  } = React.useContext(ControlContext);

  const noteName = references.find((ref) => ref.id === noteId)?.title;

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
      console.log("no mindmap");
      setShapes([]);
      setShapesMap({});
      setAnchorPoint({ x: 0, y: 0 });
    } else {
      mindmapNow.shapes ? setShapes(mindmapNow.shapes) : setShapes([]);
      mindmapNow.shapesMap
        ? setShapesMap(mindmapNow.shapesMap)
        : setShapesMap({});
      setAnchorPoint(mindmapNow.anchorPoint);
    }
    resetState();

    // get markdown
    const markdownNow = markdownRead.find((markdown) => markdown.id === noteId);
    if (markdownNow === undefined || markdownNow === null) {
      console.log("no markdown");
      setMarkdown("");
    } else {
      setMarkdown(markdownNow.content);
    }
  }, []);

  // auto save per 60 seconds
  const { setOpenSnack, setSnackMessage } = React.useContext(SnackBarContext);
  useEffect(() => {
    const saveNoteContent = () => {
      console.log("autosaving");
      setSnackMessage("Autosaving");
      setOpenSnack(true);
      const obj = {
        shapesMap: shapesMap,
        shapes: shapes,
        anchorPoint: anchorPoint,
      };
      updateMindmap(authUser.uid, noteId, obj);
    };

    const autosaveTimer = setInterval(saveNoteContent, 60000);

    return () => {
      clearInterval(autosaveTimer);
    };
  }, [shapesMap, shapes, anchorPoint]);

  // markdown
  const { markdown, setMarkdown } = React.useContext(MarkDownContext);

  // show which one
  const [showPdf, setShowPdf] = React.useState(true);
  const [showBoard, setShowBoard] = React.useState(true);
  const [showMarkdown, setShowMarkdown] = React.useState(false);

  const handlePdfBoard = () => {
    setShowPdf(true);
    setShowBoard(true);
    setShowMarkdown(false);
    console.log("pdf board");
  };
  const handlePdfMarkdown = () => {
    setShowPdf(true);
    setShowBoard(false);
    setShowMarkdown(true);
  };
  const handleBoardMarkdown = () => {
    setShowPdf(false);
    setShowBoard(true);
    setShowMarkdown(true);
  };

  React.useEffect(() => {
    if (pdfUrl) {
      setShowPdf(true);
      setShowBoard(true);
      setShowMarkdown(false);
    } else {
      setShowBoard(true);
      setShowMarkdown(true);
    }
  }, [pdfUrl]);

  return (
    <div>
      <h1 style={{ padding: "10px 10px" }}>{noteName}</h1>
      <div style={{ height: "80vh" }}>
        <Grid container spacing={1} sx={{ height: "95%" }}>
          {pdfUrl && showPdf && (
            <Grid item xs={6} sx={{ height: "80%" }}>
              <PdfViewer pdfUrl={pdfUrl} />
            </Grid>
          )}

          {showBoard && (
            <Grid item xs={6} padding={2} sx={{ height: "115%" }}>
              {/* WORKSPACE */}
              <NoteBoard className="note-space" />
            </Grid>
          )}
          {showMarkdown && (
            <Grid item xs={6} padding={2} sx={{ height: "115%" }}>
              {/* MARKDOWN */}
              <MarkdownEditor noteId={noteId} />
            </Grid>
          )}
        </Grid>
        <NoteButtonGroups
          handlePdfBoard={handlePdfBoard}
          handlePdfMarkdown={handlePdfMarkdown}
          handleBoardMarkdown={handleBoardMarkdown}
          pdfUrl={pdfUrl}
        />
      </div>
    </div>
  );
};

export default NotePage;
