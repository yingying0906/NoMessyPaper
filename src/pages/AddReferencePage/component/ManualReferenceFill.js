import * as React from "react";
import { AuthUserContext } from "../../../auth/AuthUserContext";

import {
  writeNewReference,
  writeNewFile,
} from "../../../database/controlDatabase";

import { TextField, Button, IconButton } from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import { BackDropContext } from "../../HomePage/component/backDrop/BackDropContext";
import { SnackBarContext } from "../../../containers/SnackBars/SnackBarContext";

const ManualReferenceFill = () => {
  const [author, setAuthor] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [year, setYear] = React.useState("");
  const [journal, setPublisher] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);

  const { authUser } = React.useContext(AuthUserContext);
  const { setOpenAdd } = React.useContext(BackDropContext);
  const { setOpenSnack, setSnackMessage } = React.useContext(SnackBarContext);

  const clearFill = () => {
    setAuthor("");
    setTitle("");
    setYear("");
    setPublisher("");
    setTags("");
    setSelectedFile(null);
  };

  const submitRef = (e) => {
    // reference info
    e.preventDefault();
    const ref = {
      author: author,
      title: title,
      year: year,
      journal: journal,
      tags: tags,
      fileName: selectedFile ? selectedFile.name : null,
    };
    const referenceId = writeNewReference(authUser.uid, ref);

    // pdf
    if (selectedFile != null) {
      writeNewFile(authUser.uid, referenceId, selectedFile);
    }
    setOpenAdd(false);
    setSnackMessage("Reference added successfully");
    setOpenSnack(true);
    clearFill();
  };

  return (
    <div>
      <form autoComplete="off" onSubmit={submitRef}>
        <TextField
          disabled={authUser == null}
          label="Author"
          onChange={(e) => setAuthor(e.target.value)}
          required
          variant="outlined"
          color="primary"
          type="text"
          sx={{
            mb: 2,
          }}
          fullWidth
          value={author}
        />
        <TextField
          disabled={authUser == null}
          label="Title"
          onChange={(e) => setTitle(e.target.value)}
          required
          variant="outlined"
          color="primary"
          type="text"
          value={title}
          fullWidth
          sx={{
            mb: 2,
          }}
        />
        <TextField
          disabled={authUser == null}
          label="Year"
          onChange={(e) => setYear(e.target.value)}
          required
          variant="outlined"
          color="primary"
          type="number"
          value={year}
          fullWidth
          sx={{
            mb: 2,
          }}
        />
        <TextField
          disabled={authUser == null}
          label="Journal"
          onChange={(e) => setPublisher(e.target.value)}
          required
          variant="outlined"
          color="primary"
          type="text"
          value={journal}
          fullWidth
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
          disabled={authUser == null}
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
    </div>
  );
};

export default ManualReferenceFill;
