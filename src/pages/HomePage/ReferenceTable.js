import * as React from "react";
import "./ReferenceTable.css";
import Tooltip from "@mui/material/Tooltip";

import { columns } from "./component/ReferenceTableInfo";
import { DataGrid } from "@mui/x-data-grid";
import { AuthUserContext } from "../../auth/AuthUserContext";
import { BackDropContext } from "./component/backDrop/BackDropContext";
import { RefTableToolBar } from "./component/ReferenceTableToolBar";

const ReferenceTable = (props) => {
  const { authUser } = React.useContext(AuthUserContext);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  const { setOpenEdit, setEditingFile, references } =
    React.useContext(BackDropContext);

  const handleEdit = (UID, RefId, RefFileName) => {
    setOpenEdit(true);
    setEditingFile(references.find((ref) => ref.id === RefId));
  };

  // set the uid to each row
  const columnsWithUID = columns.map((column) => {
    if (column.field === "controlButtons") {
      return {
        ...column,
        renderCell: (params) =>
          column.renderCell({
            ...params,
            UID: authUser.uid,
            handleEdit: handleEdit,
          }),
      };
    }
    if (
      column.field === "title" ||
      column.field === "author" ||
      column.field === "journal"
    ) {
      return {
        ...column,
        renderCell: (params) => (
          <div className="wrap-cell">
            <Tooltip title={params.value}>
              <span>{params.value}</span>
            </Tooltip>
          </div>
        ),
      };
    }
    return column;
  });

  // table
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        components={{
          Toolbar: () => (
            <RefTableToolBar
              authUser={authUser}
              rowSelected={rowSelectionModel}
              references={props.references}
            />
          ),
        }}
        autoHeight
        resizable
        className="ReferenceTable"
        rows={props.references}
        columns={columnsWithUID}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
      />
    </div>
  );
};

export default ReferenceTable;
