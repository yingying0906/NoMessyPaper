import * as React from "react";
import { TextField, Button, IconButton } from "@mui/material";
import { AuthUserContext } from "../../../auth/AuthUserContext";

import {
  writeNewReference,
  writeNewFile,
} from "../../../database/controlDatabase";

import ClearIcon from "@mui/icons-material/Clear";

import { BackDropContext } from "../../HomePage/component/backDrop/BackDropContext";
import { SnackBarContext } from "../../../containers/SnackBars/SnackBarContext";

const BibtexReference = () => {
  var parse = require("bibtex-parser");

  const [bibtex, setBibtex] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isValidBibTeX, setIsValidBibTeX] = React.useState(true);

  const { authUser } = React.useContext(AuthUserContext);

  const { setOpenAdd } = React.useContext(BackDropContext);
  const { setOpenSnack, setSnackMessage } = React.useContext(SnackBarContext);

  // check bibtex
  const isBibTeXEntry = (text) => {
    // Regular expression pattern to match BibTeX entry
    const pattern = /^\s*@.+{\s*([^,\s]+)/;

    return pattern.test(text);
  };

  // form
  const clearFill = () => {
    setBibtex("");
    setSelectedFile(null);
  };

  const submitRef = (e) => {
    e.preventDefault();
    const bibtexParse = parse(bibtex);

    const entryKey = Object.keys(bibtexParse)[0];
    const entry = bibtexParse[entryKey];

    console.log(entry.AUTHOR);
    const ref = {
      author: entry.AUTHOR ? entry.AUTHOR : "-",
      title: entry.TITLE ? entry.TITLE : "-",
      year: entry.YEAR ? entry.YEAR : "-",
      journal: entry.JOURNAL ? entry.JOURNAL : "-",
      tags: tags,
      fileName: selectedFile ? selectedFile.name : null,
    };
    const referenceId = writeNewReference(authUser.uid, ref);

    // pdf
    if (selectedFile != null) {
      writeNewFile(authUser.uid, referenceId, selectedFile);
    }
    setSnackMessage("Reference added successfully");
    setOpenSnack(true);
    setOpenAdd(false);

    clearFill();
  };

  return (
    <form autoComplete="off" onSubmit={submitRef}>
      <TextField
        disabled={authUser == null}
        label="Bibtex"
        onChange={(e) => {
          const value = e.target.value;
          setBibtex(value);

          // Check if the input value is a valid BibTeX entry
          const isValid = isBibTeXEntry(value);
          setIsValidBibTeX(isValid);
        }}
        required
        variant="outlined"
        color="primary"
        type="text"
        value={bibtex}
        fullWidth
        multiline
        rows={15}
        sx={{
          mb: 2,
        }}
      />
      <TextField
        disabled={authUser == null}
        label="tags"
        onChange={(e) => setTags(e.target.value)}
        required
        variant="outlined"
        color="primary"
        type="text"
        value={tags}
        fullWidth
        sx={{
          mb: 2,
        }}
      />
      <Button fullWidth sx={{ mb: 2 }} variant="outlined">
        <label className="custom-file-upload">
          Upload PDF (not necessary)
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </label>
      </Button>
      {selectedFile && (
        <div style={{ marginBottom: "4px" }}>
          <span style={{ color: "black" }}>{selectedFile.name}</span>
          <IconButton onClick={() => setSelectedFile(null)}>
            <ClearIcon />
          </IconButton>
        </div>
      )}

      <Button
        disabled={authUser == null || !isValidBibTeX}
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mb: 2,
        }}
      >
        Submit
      </Button>

      <Button
        disabled={authUser == null}
        variant="outlined"
        color="error"
        fullWidth
        onClick={clearFill}
        sx={{
          mb: 2,
        }}
      >
        Reset
      </Button>
    </form>
  );
};

export default BibtexReference;
