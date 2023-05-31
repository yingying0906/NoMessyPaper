import * as React from "react";
import "./ReferenceTable.css";
import Tooltip from "@mui/material/Tooltip";

import { columns } from "./ReferenceTableInfo";
import { DataGrid } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { AuthUserContext } from "../../../../auth/AuthUserContext";
import { BackDropContext } from "../backDrop/BackDropContext";
import { ReferenceContext } from "../../../../database/ReferenceContext";
import { RefTableToolBar } from "./ReferenceTableToolBar";

const ReferenceTable = (props) => {
  const { authUser } = React.useContext(AuthUserContext);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  const { setOpenEdit, setEditingFile } = React.useContext(BackDropContext);

  const { references } = React.useContext(ReferenceContext);

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
    } else if (column.field === "tags") {
      return {
        ...column,
      };
    } else {
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
        rows={
          props.page === "all"
            ? props.references
            : props.references.filter(
                (ref) =>
                  Array.isArray(ref.categories) &&
                  ref.categories?.includes(props.page.toString())
              )
        }
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
