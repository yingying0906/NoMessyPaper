import * as React from "react";
import { IconButton } from "@mui/material";

import { deleteReference } from "../../../../database/controlDatabase";
import { BackDropContext } from "../backDrop/BackDropContext";

import DeleteIcon from "@mui/icons-material/Delete";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const handleDeleteMultiple = (rowSelected, refs, authUser) => {
  if (window.confirm("Are you sure you want to delete these references?")) {
    refs.forEach((ref) => {
      if (rowSelected.includes(ref.id)) {
        deleteReference(authUser.uid, ref.id, ref.fileName);
      }
    });
  }
};

const handleExportMultiple = (rowSelected, refs, authUser) => {
  if (window.confirm("Are you sure you want to export these references?")) {
    const bibtexEntries = [];
    refs.forEach((ref) => {
      if (rowSelected.includes(ref.id)) {
        if (ref.bibtex) {
          bibtexEntries.push(ref.bibtex);
        } else {
          const author = ref.author;
          const journal = ref.journal;
          const title = ref.title;
          const year = ref.year;

          const entry = `@article{Name,
            title={${title}},
            author={${author}},
            year={${year}},
            journal={${journal}},
          }`;
          bibtexEntries.push(entry);
        }
      }
    });

    const bibtexString = bibtexEntries.join("\n");

    // Create a Blob with the BibTeX string
    const blob = new Blob([bibtexString], { type: "text/plain" });

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = "references.bib"; // Specify the desired file name

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up by revoking the temporary URL
    window.URL.revokeObjectURL(url);
  }
};

const RefTableToolBar = (props) => {
  const { rowSelected, authUser, references } = props;

  const { setOpenAdd } = React.useContext(BackDropContext);

  const handleAddRef = () => {
    setOpenAdd(true);
  };

  return (
    <div className="RefTableToolbar">
      <IconButton onClick={handleAddRef}>
        <AddOutlinedIcon />
      </IconButton>
      {rowSelected.length > 0 && (
        <>
          <IconButton
            onClick={() =>
              handleDeleteMultiple(rowSelected, references, authUser)
            }
          >
            <DeleteIcon />
          </IconButton>

          <IconButton
            onClick={() =>
              handleExportMultiple(rowSelected, references, authUser)
            }
          >
            123
          </IconButton>
        </>
      )}
    </div>
  );
};

export { RefTableToolBar };
