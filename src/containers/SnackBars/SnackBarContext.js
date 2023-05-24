import * as React from "react";

export const SnackBarContext = React.createContext();

export const SnackBarProvider = (props) => {
  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState("");

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const contextValue = {
    openSnack,
    setOpenSnack,
    snackMessage,
    setSnackMessage,
    handleSnackClose,
  };

  return (
    <SnackBarContext.Provider value={contextValue}>
      {props.children}
    </SnackBarContext.Provider>
  );
};

export default SnackBarProvider;
