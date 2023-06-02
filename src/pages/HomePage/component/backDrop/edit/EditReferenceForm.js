import * as React from "react";
import { AuthUserContext } from "../../../../../auth/AuthUserContext";
import { BackDropContext } from "../BackDropContext";
import {
  editReference,
  writeNewFile,
} from "../../../../../database/controlDatabase";

import { TextField, Button, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import EditCategoryChoose from "./EditCategoryChoose";

import { ReferenceContext } from "../../../../../database/ReferenceContext";

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

const EditReferenceForm = () => {
  const { authUser } = React.useContext(AuthUserContext);
  const { editingFile, setOpenEdit } = React.useContext(BackDropContext);

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [editFormState, setEditFormState] = React.useState({
    author: "",
    title: "",
    year: "",
    journal: "",
    tags: "",
    link: "",
  });
  const { categories, setCategories } = React.useContext(ReferenceContext);

  React.useEffect(() => {
    if (editingFile) {
      setEditFormState({
        author: editingFile.author || "",
        title: editingFile.title || "",
        year: editingFile.year || "",
        journal: editingFile.journal || "",
        tags: editingFile.tags || "",
        link: editingFile.link || "",
      });

      //loop editingfile and setCategories checked
      setCategories(
        categories.map((category) => {
          if (editingFile.categories?.includes(category.refID)) {
            return { ...category, checked: true };
          }
          return { ...category, checked: false };
        })
      );
    }
  }, [editingFile]);

  const submitRef = (e) => {
    e.preventDefault();
    setOpenEdit(false);
    // reference info

    const { author, title, year, journal, tags, link } = editFormState;

    const writeCategories = categories
      .filter((cat) => cat.checked)
      .map((cat) => cat.refID);

    console.log("hi", writeCategories);

    const ref = {
      author: author,
      title: title,
      year: year,
      journal: journal,
      tags: tags,
      link: link,
      fileName: selectedFile ? selectedFile.name : null,
      categories: writeCategories,
    };
    editReference(authUser.uid, editingFile.id, ref);

    if (selectedFile) {
      writeNewFile(authUser.uid, editingFile.id, selectedFile);
    }

    setSelectedFile(null);
  };

  const handleTextChange = (e, stateKey) => {
    setEditFormState((prevState) => ({
      ...prevState,
      [stateKey]: e.target.value,
    }));
  };

  return (
    <div>
      <form autoComplete="off" onSubmit={submitRef}>
        <div className="formBox">
          <div>
            {infoFields.map((field) => (
              <TextField
                size="small"
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
                value={editFormState[field.state]}
              />
            ))}

            {editingFile.fileName ? (
              <div style={{ color: "black" }}>
                {editingFile && editingFile.fileName}
              </div>
            ) : (
              <Button fullWidth sx={{ mb: 2 }} variant="outlined">
                <label className="custom-file-upload">
                  Upload PDF (not necessary)
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </label>
              </Button>
            )}

            {selectedFile && (
              <div style={{ marginBottom: "4px" }}>
                <span style={{ color: "black" }}>{selectedFile.name}</span>
                <IconButton onClick={() => setSelectedFile(null)}>
                  <ClearIcon />
                </IconButton>
              </div>
            )}
          </div>
          <div>
            <EditCategoryChoose />
          </div>
        </div>

        <Button
          disabled={authUser == null}
          type="submit"
          variant="contained"
          sx={{
            mb: 2,
          }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default EditReferenceForm;
