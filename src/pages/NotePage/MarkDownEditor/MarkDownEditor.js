import React from "react";
import ReactMarkdown from "react-markdown";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MarkDownContext } from "./MarkDownContext";
import Fab from "@mui/material/Fab";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Tooltip } from "@mui/material";
import { updateMarkdown } from "../../../database/controlDatabase";
import { AuthUserContext } from "../../../auth/AuthUserContext";
import { SnackBarContext } from "../../../containers/SnackBars/SnackBarContext";

const MarkdownEditor = (props) => {
  const { markdown, setMarkdown } = React.useContext(MarkDownContext);

  const { authUser } = React.useContext(AuthUserContext);
  const { setSnackMessage, setOpenSnack } = React.useContext(SnackBarContext);

  const handleMarkdownChange = (event) => {
    setMarkdown(event.target.value);
  };

  const saveMarkdown = () => {
    updateMarkdown(authUser.uid, props.noteId, {
      content: markdown,
    });
    setSnackMessage("Saved MD !");
    setOpenSnack(true);
  };

  const renderers = {
    // Customize the styles for the text elements
    paragraph: ({ children }) => <p style={{ fontSize: "14px" }}>{children}</p>,
    heading: ({ level, children }) => {
      const Tag = `h${level}`;
      return <Tag style={{ fontSize: "16px" }}>{children}</Tag>;
    },
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Box
        flex="1"
        height="50%"
        maxHeight="50%"
        width="100%"
        overflow="scroll"
        textAlign="left"
        backgroundColor="rgb(250, 250, 250)"
        padding={3}
        boxShadow={3}
        marginBottom={3}
      >
        <ReactMarkdown id="mdDownload" renderers={renderers}>
          {markdown}
        </ReactMarkdown>
      </Box>
      <Box flex="1" height="50%" width="100%" overflow="auto" textAlign="left">
        <TextField
          multiline
          rows={15}
          value={markdown}
          onChange={handleMarkdownChange}
          placeholder="Enter Markdown text"
          variant="outlined"
          style={{ flex: "1", height: "50%", width: "100%" }}
        />
        <Tooltip title="saveMarkDown">
          <Fab
            onClick={saveMarkdown}
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              backgroundColor: "#526D82",
              color: "#fff",
            }}
            aria-label="like"
          >
            <SaveOutlinedIcon />
          </Fab>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default MarkdownEditor;
