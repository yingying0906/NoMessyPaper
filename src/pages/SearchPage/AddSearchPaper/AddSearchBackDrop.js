import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ManualReferenceFill from "../../AddReferencePage/component/ManualReferenceFill";
import "../../AddReferencePage/component/ReferenceFill.css";

const AddSearchBackDrop = (props) => {
  return (
    <div
      style={{
        width: "60vw",
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
          padding: "0 10px",
        }}
      >
        <h4 style={{ color: "black", marginBottom: "0" }}>Add Reference</h4>
        <IconButton
          onClick={() => {
            props.handleBackDropClose();
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <ManualReferenceFill
        handleBackDropClose={props.handleBackDropClose}
        paperLink={props.paperLink}
      />
    </div>
  );
};

export default AddSearchBackDrop;
