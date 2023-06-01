import * as React from "react";

import { TextField, Button, IconButton } from "@mui/material";

import FillButtonGroup from "./FillButtonGroup";
import {
  writeNewReference,
  writeNewFile,
} from "../../../database/controlDatabase";

import { AuthUserContext } from "../../../auth/AuthUserContext";
import { BackDropContext } from "../../HomePage/component/backDrop/BackDropContext";
import { SnackBarContext } from "../../../containers/SnackBars/SnackBarContext";
import { ReferenceContext } from "../../../database/ReferenceContext";
import { FormStateContext } from "../../../database/FormStateContext.js";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";

import ClearIcon from "@mui/icons-material/Clear";

import "./ReferenceFill.css";
import CategoryChoose from "./CategoryChoose";
import { Link } from "@mui/material";

const infoFields = [
  {
    label: "Author",
    state: "author",
    required: false,
    type: "text",
  },
  {
    label: "Title",
    state: "title",
    required: true,
    type: "text",
  },
  {
    label: "Year",
    state: "year",
    required: false,
    type: "number",
  },
  {
    label: "Journal",
    state: "journal",
    required: false,
    type: "text",
  },
  {
    label: "Tags",
    state: "tags",
    required: false,
    type: "text",
  },
  {
    label: "Link",
    state: "link",
    required: false,
    type: "url",
  },
];

const ManualReferenceFill = (props) => {
  const { formState, setFormState } = React.useContext(FormStateContext);
  const { authUser } = React.useContext(AuthUserContext);
  const { setOpenAdd } = React.useContext(BackDropContext);
  const { setOpenSnack, setSnackMessage } = React.useContext(SnackBarContext);

  const { categories, setCategories } = React.useContext(ReferenceContext);

  const clearFill = () => {
    setFormState({
      author: "",
      title: "",
      year: "",
      journal: "",
      tags: "",
      selectedFile: null,
      link: "",
    });
    setCategories(
      categories.map((cat) => {
        return { ...cat, checked: false };
      })
    );
  };

  const submitRef = (e) => {
    e.preventDefault();
    const { author, title, year, journal, tags, selectedFile, link } =
      formState;

    const writeCategories = categories
      .filter((cat) => cat.checked)
      .map((cat) => cat.refID);

    console.log("hi", writeCategories);

    const ref = {
      author,
      title,
      year,
      journal,
      tags,
      fileName: selectedFile ? selectedFile.name : null,
      categories: writeCategories,
      link: link,
    };
    const referenceId = writeNewReference(authUser.uid, ref);

    if (selectedFile != null) {
      writeNewFile(authUser.uid, referenceId, selectedFile);
    }
    setOpenAdd(false);
    setSnackMessage("Reference added successfully");
    setOpenSnack(true);
    if (props && props.handleClose) props.handleClose();
    clearFill();
  };

  const handleTextChange = (e, stateKey) => {
    setFormState((prevState) => ({
      ...prevState,
      [stateKey]: e.target.value,
    }));
  };

  return (
    <div>
      <form autoComplete="off" onSubmit={submitRef}>
        <div className="formBox">
          <div>
            <h2>Information</h2>
            {infoFields.map((field) => (
              <TextField
                key={field.state}
                disabled={authUser == null}
                label={field.label}
                onChange={(e) => handleTextChange(e, field.state)}
                required={field.required}
                variant="outlined"
                color="primary"
                type={field.type}
                sx={{
                  mb: 2,
                }}
                fullWidth
                value={formState[field.state]}
              />
            ))}
            <Button fullWidth sx={{ mb: 2 }} variant="outlined">
              <label className="custom-file-upload">
                Upload PDF (not necessary)
                <input
                  type="file"
                  onChange={(e) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      selectedFile: e.target.files[0],
                      fileInputKey: Date.now(),
                    }))
                  }
                  key={formState.fileInputKey}
                />
              </label>
            </Button>

            {props.paperLink !== "" && props.paperLink !== undefined && (
              <>
                <Link href={props.paperLink} target="_blank">
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ margin: "5px 5px" }}
                    startIcon={<InsertLinkOutlinedIcon />}
                  >
                    PDF Link
                  </Button>
                </Link>
              </>
            )}

            {formState.selectedFile && (
              <div style={{ marginBottom: "4px" }}>
                <span style={{ color: "black" }}>
                  {formState.selectedFile.name}
                </span>
                <IconButton
                  onClick={() =>
                    setFormState((prevState) => ({
                      ...prevState,
                      selectedFile: null,
                    }))
                  }
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

        <FillButtonGroup clearFill={clearFill} isValid={1} />
      </form>
    </div>
  );
};

export default ManualReferenceFill;
