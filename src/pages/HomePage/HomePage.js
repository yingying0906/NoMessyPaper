import "./HomePage.css";
import * as React from "react";

import ReferenceTable from "./ReferenceTable";

import { ReferenceContext } from "../../database/ReferenceContext";
import { BackDropContext } from "./component/backDrop/BackDropContext";

import Backdrop from "@mui/material/Backdrop";
import AddReferenceBackDrop from "./component/backDrop/add/AddReferenceBackDrop";
import EditReferenceBackDrop from "./component/backDrop/edit/EditReferenceBackDrop";

const HomePage = () => {
  const { references } = React.useContext(ReferenceContext);

  const { openAdd, setOpenAdd, openEdit, setOpenEdit } =
    React.useContext(BackDropContext);

  const handleClose = (event) => {
    setOpenAdd(false);
    setOpenEdit(false);
  };

  // rendering
  return (
    <div className="Homepage">
      <ReferenceTable references={references} />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openAdd}
        onClick={handleClose}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <AddReferenceBackDrop handleClose={handleClose} />
        </div>
      </Backdrop>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openEdit}
        onClick={handleClose}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <EditReferenceBackDrop handleClose={handleClose} />
        </div>
      </Backdrop>
    </div>
  );
};

export default HomePage;
