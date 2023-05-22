import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, Button, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { deleteReference } from "../../database/controlDatabase";
import { AuthUserContext } from "../../auth/AuthUserContext";

const columns = [
  { field: "fakeId", headerName: "ID", sortable: false, flex: 0.5 },
  { field: "author", headerName: "Author", flex: 1 },
  { field: "title", headerName: "Title", flex: 2 },
  {
    field: "year",
    headerName: "Year",
    flex: 1,
    sortable: true,
  },
  {
    field: "journal",
    headerName: "Journal",
    flex: 2,
  },
  {
    field: "tags",
    headerName: "Tags",
    flex: 2,
    renderCell: (params) => {
      const items = params.value ? params.value.split(",") : [];

      return (
        <div>
          {items.map((item, index) => (
            <Chip key={index} sx={{ mr: 1 }} label={item.trim()} />
          ))}
        </div>
      );
    },
  },
  {
    field: "controlButtons",
    headerName: "",
    flex: 2,
    align: "right",
    renderCell: (params) => {
      const handleButtonClick = () => {
        deleteReference(params.UID, params.row.id);
      };

      return (
        <div>
          <IconButton onClick={() => handleButtonClick()}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleButtonClick()}>
            <DeleteIcon />
          </IconButton>
        </div>
      );
    },
  },
];

export default function RefTable(props) {
  const { authUser } = React.useContext(AuthUserContext);

  const columnsWithUID = columns.map((column) => {
    if (column.field === "controlButtons") {
      return {
        ...column,
        renderCell: (params) =>
          column.renderCell({ ...params, UID: authUser.uid }),
      };
    }
    return column;
  });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={props.references}
        columns={columnsWithUID}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
