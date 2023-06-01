import * as React from "react";
import { Chip, IconButton, Tooltip } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

import { enterLink } from "../../../../database/controlDatabase";
import { Link } from "react-router-dom";

const columns = [
  { field: "fakeId", headerName: "ID", sortable: false, flex: 1 },
  { field: "author", headerName: "Author", flex: 3 },
  { field: "title", headerName: "Title", flex: 3 },
  {
    field: "year",
    headerName: "Year",
    flex: 2,
    sortable: true,
  },
  {
    field: "journal",
    headerName: "Journal",
    flex: 3,
  },
  {
    field: "tags",
    headerName: "Tags",
    flex: 3,
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
      return (
        <div>
          {params.row.link && (
            <Tooltip title="Open Link in New Tab">
              <IconButton onClick={() => enterLink(params.UID, params.row.id)}>
                <OpenInNewIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Note">
            <Link to={`/Note/${params.row.id}`}>
              <IconButton>
                <TextSnippetIcon />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                params.handleEdit(
                  params.UID,
                  params.row.id,
                  params.row.fileName
                );
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </div>
      );
    },
  },
];

export { columns };
