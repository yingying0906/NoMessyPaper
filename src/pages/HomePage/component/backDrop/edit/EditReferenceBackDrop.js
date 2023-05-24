import * as React from "react";

import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import EditReferenceForm from "./EditReferenceForm";

const EditReferenceBackDrop = (props) => {
  return (
    <div
      style={{
        width: "40vw",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ color: "black", marginBottom: "0" }}>Edit Reference</h4>
        <IconButton onClick={props.handleClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <EditReferenceForm />
    </div>
  );
};

export default EditReferenceBackDrop;
