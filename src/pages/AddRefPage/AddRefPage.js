import "./AddRefPage.css";

import { TextField, Button } from "@mui/material";
import { writeNewReference } from "../../database/controlDatabase";

import { useState, useContext } from "react";
import { AuthUserContext } from "../../auth/AuthUserContext";

const AddRefPage = () => {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [publisher, setPublisher] = useState("");
  const [tags, setTags] = useState("");

  const { authUser } = useContext(AuthUserContext);

  const submitRef = (e) => {
    e.preventDefault();
    const ref = {
      author: author,
      title: title,
      year: year,
      publisher: publisher,
      tags: tags,
    };
    console.log(ref);
    writeNewReference(authUser.uid, ref);
  };

  return (
    <div className="AddRefPage">
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
            label="Publisher"
            onChange={(e) => setPublisher(e.target.value)}
            required
            variant="outlined"
            color="primary"
            type="text"
            value={publisher}
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
    </div>
  );
};

export default AddRefPage;
