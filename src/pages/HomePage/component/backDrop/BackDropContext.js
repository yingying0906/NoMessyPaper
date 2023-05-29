import * as React from "react";

export const BackDropContext = React.createContext();

const BackDropProvider = ({ children }) => {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  const [editingFile, setEditingFile] = React.useState("");
  const [editingFileRef, setEditingFileRef] = React.useState(null);

  // return context
  const contextValue = {
    openEdit,
    setOpenEdit,
    openAdd,
    setOpenAdd,
    editingFile,
    setEditingFile,
    editingFileRef,
    setEditingFileRef,
  };
  return (
    <BackDropContext.Provider value={contextValue}>
      {children}
    </BackDropContext.Provider>
  );
};
export default BackDropProvider;
