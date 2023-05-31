import * as React from "react";
import "./ReferenceFill.css";

import { TextField, Button, IconButton } from "@mui/material";

import {
  writeNewReference,
  writeNewFile,
} from "../../../database/controlDatabase";

import { AuthUserContext } from "../../../auth/AuthUserContext";
import { BackDropContext } from "../../HomePage/component/backDrop/BackDropContext";
import { SnackBarContext } from "../../../containers/SnackBars/SnackBarContext";
import { ReferenceContext } from "../../../database/ReferenceContext";

import ClearIcon from "@mui/icons-material/Clear";

import FillButtonGroup from "./FillButtonGroup";
import CategoryChoose from "./CategoryChoose";

const BibtexReference = () => {
  var parse = require("bibtex-parser");

  const [formState, setFormState] = React.useState({
    bibtex: "",
    tags: "",
    selectedFile: null,
    link: "",
  });

  const [isValidBibTeX, setIsValidBibTeX] = React.useState(true);

  const { authUser } = React.useContext(AuthUserContext);

  const { setOpenAdd } = React.useContext(BackDropContext);
  const { setOpenSnack, setSnackMessage } = React.useContext(SnackBarContext);

  const { categories, setCategories } = React.useContext(ReferenceContext);

  // check bibtex
  const isBibTeXEntry = (text) => {
    // Regular expression pattern to match BibTeX entry
    const pattern = /^\s*@.+{\s*([^,\s]+)/;

    return pattern.test(text);
  };

  // form
  const clearFill = () => {
    setFormState({
      bibtex: "",
      tags: "",
      selectedFile: null,
    });
    setCategories(
      categories.map((cat) => {
        return { ...cat, checked: false };
      })
    );
  };

  const submitRef = (e) => {
    if (!isValidBibTeX) {
      setSnackMessage("Invalid BibTeX entry");
      setOpenSnack(true);
      return;
    }

    e.preventDefault();
    const bibtexParse = parse(formState.bibtex);

    const entryKey = Object.keys(bibtexParse)[0];
    const entry = bibtexParse[entryKey];

    const { selectedFile, tags } = formState;

    const writeCategories = categories
      .filter((cat) => cat.checked)
      .map((cat) => cat.refID);

    const ref = {
      author: entry.AUTHOR ? entry.AUTHOR : "-",
      title: entry.TITLE ? entry.TITLE : "-",
      year: entry.YEAR ? entry.YEAR : "-",
      journal: entry.JOURNAL ? entry.JOURNAL : "-",
      tags: tags,
      fileName: selectedFile ? selectedFile.name : null,
      categories: writeCategories,
      bibtex: formState.bibtex,
      link: formState.link,
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
    <div>
      <form autoComplete="off" onSubmit={submitRef}>
        <div className="formBox">
          <div>
            <TextField
              disabled={authUser == null}
              label="Bibtex"
              placeholder="Paste valid BibTeX entry here"
              onChange={(e) => {
                const value = e.target.value;
                setFormState((prevState) => ({
                  ...prevState,
                  bibtex: value,
                }));

                // Check if the input value is a valid BibTeX entry
                const isValid = isBibTeXEntry(value);
                setIsValidBibTeX(isValid);
              }}
              required
              variant="outlined"
              color="primary"
              type="text"
              value={formState.bibtex}
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
              onChange={(e) => {
                const value = e.target.value;
                setFormState((prevState) => ({
                  ...prevState,
                  tags: value,
                }));
              }}
              variant="outlined"
              color="primary"
              type="text"
              value={formState.tags}
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
                  onChange={(e) => {
                    const value = e.target.files[0];
                    setFormState((prevState) => ({
                      ...prevState,
                      selectedFile: value,
                    }));
                  }}
                />
              </label>
            </Button>
            {formState.selectedFile && (
              <div style={{ marginBottom: "4px" }}>
                <span style={{ color: "black" }}>
                  {formState.selectedFile.name}
                </span>
                <IconButton
                  onClick={() => {
                    setFormState((prevState) => ({
                      ...prevState,
                      selectedFile: null,
                    }));
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </div>
            )}
          </div>
          <div>
            <h2>Category</h2>
            <CategoryChoose />
          </div>
        </div>

        <FillButtonGroup clearFill={clearFill} isValid={isValidBibTeX} />
      </form>
    </div>
  );
};

export default BibtexReference;
