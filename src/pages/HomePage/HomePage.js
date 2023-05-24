import "./HomePage.css";
import * as React from "react";

import ReferenceTable from "./ReferenceTable";

import { AuthUserContext } from "../../auth/AuthUserContext";
import { BackDropContext } from "./component/backDrop/BackDropContext";

import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";

import Backdrop from "@mui/material/Backdrop";
import AddReferenceBackDrop from "./component/backDrop/add/AddReferenceBackDrop";
import EditReferenceBackDrop from "./component/backDrop/edit/EditReferenceBackDrop";

import CircularProgress from "@mui/material/CircularProgress";

const HomePage = () => {
  const { authUser } = React.useContext(AuthUserContext);

  const [loading, setLoading] = React.useState(true);
  const { references, setReferences } = React.useContext(BackDropContext);

  // keep getting data from database
  React.useEffect(() => {
    const referenceRef = ref(db, `referenceList/${authUser?.uid}`);
    const handleChange = (snapshot) => {
      if (snapshot.exists()) {
        const referencesData = snapshot.val();
        const referencesArray = Object.keys(referencesData).map(
          (key, index) => ({
            id: key,
            fakeId: index + 1,
            ...referencesData[key],
          })
        );

        setReferences(referencesArray);
        setLoading(false);
      } else {
        setReferences([]);
        setLoading(false);
      }
    };
    const referenceListener = onValue(
      referenceRef,
      (snapshot) => {
        handleChange(snapshot);
      },
      {
        onlyOnce: false,
      }
    );

    // Clean up the listener
    return () => {
      referenceListener();
    };
  }, [authUser, setReferences]);

  // backdrop

  const { openAdd, setOpenAdd, openEdit, setOpenEdit } =
    React.useContext(BackDropContext);

  const handleClose = (event) => {
    setOpenAdd(false);
    setOpenEdit(false);
  };

  // rendering
  return (
    <div className="Homepage">
      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        <ReferenceTable references={references} />
      )}

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
