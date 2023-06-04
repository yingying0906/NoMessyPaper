import { Button, IconButton, Tooltip } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import IosShareIcon from "@mui/icons-material/IosShare";

import * as React from "react";
import { saveAs } from "file-saver";
import { MarkDownContext } from "../MarkDownEditor/MarkDownContext";

import "./NoteButtonGroups.css";

const NoteButtonGroups = (props) => {
  const { markdown, setMarkdown } = React.useContext(MarkDownContext);

  const { handlePdfBoard, handlePdfMarkdown, handleBoardMarkdown, pdfUrl } =
    props;

  const handleExportMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `markdown.md`);
  };

  return (
    <div className="notebuttongroups">
      <IconButton
        onClick={() => {
          handlePdfBoard();
        }}
        disabled={pdfUrl === null}
      >
        <div style={{ borderRight: "2px solid #ccc", padding: "4px" }}>
          <PictureAsPdfIcon />
        </div>
        <div style={{ padding: "4px" }}>
          <DashboardIcon />
        </div>
      </IconButton>
      <IconButton
        onClick={() => {
          handlePdfMarkdown();
        }}
        disabled={pdfUrl === null}
      >
        <div style={{ borderRight: "2px solid #ccc", padding: "4px" }}>
          <PictureAsPdfIcon />
        </div>
        <div style={{ padding: "4px" }}>
          <TextSnippetIcon />
        </div>
      </IconButton>
      <IconButton
        onClick={() => {
          handleBoardMarkdown();
        }}
      >
        <div style={{ borderRight: "2px solid #ccc", padding: "4px" }}>
          <DashboardIcon />
        </div>
        <div style={{ padding: "4px" }}>
          <TextSnippetIcon />
        </div>
      </IconButton>

      <Tooltip title="Export To .md">
        <IconButton variant="contained" onClick={handleExportMarkdown}>
          <IosShareIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default NoteButtonGroups;
