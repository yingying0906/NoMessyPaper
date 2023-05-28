import * as React from "react";
import { AuthUserContext } from "../../../auth/AuthUserContext";
import {
  writeNewReference,
  writeNewFile,
} from "../../../database/controlDatabase";
import {
  TextField,
  Button,
  IconButton,
  FormGroup,
  Checkbox,
  ButtonGroup,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import ClearIcon from "@mui/icons-material/Clear";
import { BackDropContext } from "../../HomePage/component/backDrop/BackDropContext";
import { SnackBarContext } from "../../../containers/SnackBars/SnackBarContext";
import "./ReferenceFill.css";
import FillButtonGroup from "./FillButtonGroup";

const fields = [
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

  const clearFill = () => {
    setFormState({
      author: "",
      title: "",
      year: "",
      journal: "",
      tags: "",
      selectedFile: null,
    });
  };

  const submitRef = (e) => {
    e.preventDefault();
    const { author, title, year, journal, tags, selectedFile } = formState;
    const ref = {
      author,
      title,
      year,
      journal,
      tags,
      fileName: selectedFile ? selectedFile.name : null,
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

  const handleChange = (e, stateKey) => {
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
            {fields.map((field) => (
              <TextField
                key={field.state}
                disabled={authUser == null}
                label={field.label}
                onChange={(e) => handleChange(e, field.state)}
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
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Label"
              />
              <FormControlLabel
                required
                control={<Checkbox />}
                label="Required"
              />
              <FormControlLabel
                disabled
                control={<Checkbox />}
                label="Disabled"
              />
            </FormGroup>
          </div>
        </div>

        <FillButtonGroup clearFill={clearFill} isValid={1} />
      </form>
    </div>
  );
};

export default ManualReferenceFill;
