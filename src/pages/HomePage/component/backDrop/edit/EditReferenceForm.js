import * as React from "react";
import { AuthUserContext } from "../../../../../auth/AuthUserContext";
import { BackDropContext } from "../BackDropContext";
import { editReference } from "../../../../../database/controlDatabase";

import { TextField, Button, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const EditReferenceForm = () => {
  const [author, setAuthor] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [year, setYear] = React.useState("");
  const [journal, setPublisher] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);

  const { authUser } = React.useContext(AuthUserContext);
  const { editingFile, setOpenEdit } = React.useContext(BackDropContext);

  React.useEffect(() => {
    if (editingFile) {
      setAuthor(editingFile.author || "");
      setTitle(editingFile.title || "");
      setYear(editingFile.year || "");
      setPublisher(editingFile.journal || "");
      setTags(editingFile.tags || "");
    }
  }, [editingFile]);

  const submitRef = (e) => {
    e.preventDefault();
    setOpenEdit(false);
    // reference info
    const ref = {
      author: author,
      title: title,
      year: year,
      journal: journal,
      tags: tags,
    };
    editReference(authUser.uid, editingFile.id, ref);
  };

  return (
    <div style={{ padding: "20px 40px" }}>
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
      </form>
    </div>
  );
};

export default EditReferenceForm;
