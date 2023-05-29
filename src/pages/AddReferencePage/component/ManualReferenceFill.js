import * as React from "react";

import {
  TextField,
  Button,
  IconButton,
  FormGroup,
  Checkbox,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

import FillButtonGroup from "./FillButtonGroup";
import {
  writeNewReference,
  writeNewFile,
} from "../../../database/controlDatabase";

import { AuthUserContext } from "../../../auth/AuthUserContext";
import { BackDropContext } from "../../HomePage/component/backDrop/BackDropContext";
import { SnackBarContext } from "../../../containers/SnackBars/SnackBarContext";
import { ReferenceContext } from "../../../database/ReferenceContext";

import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";

import "./ReferenceFill.css";
const infoFields = [
  {
    label: "Author",
    state: "author",
    required: true,
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
    required: true,
    type: "number",
  },
  {
    label: "Journal",
    state: "journal",
    required: true,
    type: "text",
  },
  {
    label: "Tags",
    state: "tags",
    required: true,
    type: "text",
  },
];

const ManualReferenceFill = () => {
  const [formState, setFormState] = React.useState({
    author: "",
    title: "",
    year: "",
    journal: "",
    tags: "",
    selectedFile: null,
  });

  const { authUser } = React.useContext(AuthUserContext);
  const { setOpenAdd } = React.useContext(BackDropContext);
  const { setOpenSnack, setSnackMessage } = React.useContext(SnackBarContext);

  const { categories, setCategories, writeCategoriesDb, loading } =
    React.useContext(ReferenceContext);
  const [newCategory, setNewCategory] = React.useState("");
  const [openNewCategory, setOpenNewCategory] = React.useState(false);

  const clearFill = () => {
    setFormState({
      author: "",
      title: "",
      year: "",
      journal: "",
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
    e.preventDefault();
    const { author, title, year, journal, tags, selectedFile } = formState;

    const writeCategories = categories
      .filter((cat) => cat.checked)
      .map((cat) => cat.name);

    const ref = {
      author,
      title,
      year,
      journal,
      tags,
      fileName: selectedFile ? selectedFile.name : null,
      categories: writeCategories,
    };
    const referenceId = writeNewReference(authUser.uid, ref);

    if (selectedFile != null) {
      writeNewFile(authUser.uid, referenceId, selectedFile);
    }
    setOpenAdd(false);
    setSnackMessage("Reference added successfully");
    setOpenSnack(true);
    clearFill();
  };

  const handleTextChange = (e, stateKey) => {
    setFormState((prevState) => ({
      ...prevState,
      [stateKey]: e.target.value,
    }));
  };

  const handleCategoryChange = (index) => {
    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories[index] = {
        ...updatedCategories[index],
        checked: !updatedCategories[index].checked,
      };
      return updatedCategories;
    });
  };

  const addCategory = (catName) => {
    setCategories((prevCategories) => [
      ...prevCategories,
      { name: `${catName}`, checked: false },
    ]);
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
            <FormGroup>
              {categories.map((category, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={category.checked}
                      onChange={() => handleCategoryChange(index)}
                      name={category.name}
                    />
                  }
                  label={category.name}
                />
              ))}
            </FormGroup>

            {openNewCategory ? (
              <div className="newCategory">
                <TextField
                  size="small"
                  label="Category Name"
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                  variant="outlined"
                  color="primary"
                  type="text"
                  sx={{
                    mb: 2,
                  }}
                  fullWidth
                  value={newCategory}
                />
                <IconButton
                  onClick={() => {
                    addCategory(newCategory);
                    setOpenNewCategory(false);
                    writeCategoriesDb(authUser.uid, newCategory);
                  }}
                >
                  <DoneIcon />
                </IconButton>
              </div>
            ) : (
              <IconButton onClick={() => setOpenNewCategory(true)}>
                <AddIcon />
              </IconButton>
            )}
          </div>
        </div>

        <FillButtonGroup clearFill={clearFill} isValid={1} />
      </form>
    </div>
  );
};

export default ManualReferenceFill;
