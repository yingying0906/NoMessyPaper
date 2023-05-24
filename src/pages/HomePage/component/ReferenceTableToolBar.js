import * as React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { deleteReference } from "../../../database/controlDatabase";
import { BackDropContext } from "./backDrop/BackDropContext";

const handleDeleteMultiple = (rowSelected, refs, authUser) => {
  console.log(rowSelected);
  if (window.confirm("Are you sure you want to delete these references?")) {
    refs.forEach((ref) => {
      if (rowSelected.includes(ref.id)) {
        deleteReference(authUser.uid, ref.id, ref.fileName);
      }
    });
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
        <IconButton
          onClick={() =>
            handleDeleteMultiple(rowSelected, references, authUser)
          }
        >
          <DeleteIcon />
        </IconButton>
      )}
    </div>
  );
};

export { RefTableToolBar };
