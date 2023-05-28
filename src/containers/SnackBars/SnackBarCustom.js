import * as React from "react";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { SnackBarContext } from "./SnackBarContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackBarCustom = () => {
  const { openSnack, handleSnackClose } = React.useContext(SnackBarContext);
  return (
    <Snackbar
      open={openSnack}
      autoHideDuration={1000}
      onClose={handleSnackClose}
    >
      <Alert
        onClose={handleSnackClose}
        severity="success"
        sx={{ width: "100%" }}
      >
        Reference successfully submitted.
      </Alert>
    </Snackbar>
  );
};

export default SnackBarCustom;
