import * as React from "react";
import "./CategoryList.css";

import { ReferenceContext } from "../../../../database/ReferenceContext";
import { AuthUserContext } from "../../../../auth/AuthUserContext";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Divider, IconButton } from "@mui/material";

import { TextField } from "@mui/material";

import {
  editCategoriesDb,
  deleteCategoriesDb,
} from "../../../../database/controlCategory";

import DoneIcon from "@mui/icons-material/Done";
import ModeOutlinedIcon from "@mui/icons-material/ModeOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const CategoryList = ({ handlePageChange, page, setPage }) => {
  const { authUser } = React.useContext(AuthUserContext);
  const { categories } = React.useContext(ReferenceContext);
  const [selectedIndex, setSelectedIndex] = React.useState("all");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [categoryName, setCategoryName] = React.useState("");

  React.useEffect(() => {
    setCategoryName(
      categories.find((category) => category.refID === page)?.name
    );
  }, [page, categories, setCategoryName]);

  return (
    <div style={{ textAlign: "left" }}>
      <h3 style={{ paddingLeft: "4px" }}>
        {openEdit ? (
          <div className="editCategory">
            <TextField
              size="small"
              label="Category Name"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              fullWidth
              margin="normal"
            />

            <IconButton
              onClick={() => {
                editCategoriesDb(authUser.uid, page, categoryName);
                setOpenEdit(false);
              }}
            >
              <DoneIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => {
                deleteCategoriesDb(authUser.uid, page);
                setOpenEdit(false);
                setPage("all");
              }}
            >
              <DeleteForeverIcon fontSize="small" />
            </IconButton>
          </div>
        ) : (
          <>
            {page === "all"
              ? "All"
              : categories.find((category) => category.refID === page)?.name}

            {page !== "all" && (
              <IconButton onClick={() => setOpenEdit(true)}>
                <ModeOutlinedIcon />
              </IconButton>
            )}
          </>
        )}
      </h3>
      <List>
        <ListItem disablePadding key="all">
          <ListItemButton
            selected={selectedIndex === "all"}
            onClick={() => {
              handlePageChange("all");
              setSelectedIndex("all");
            }}
          >
            <ListItemText primary="All" />
          </ListItemButton>
        </ListItem>
        {categories.map((category, index) => {
          return (
            <ListItem disablePadding key={index}>
              <ListItemButton
                selected={selectedIndex === category.refID}
                onClick={() => {
                  handlePageChange(category.refID);
                  setSelectedIndex(category.refID);
                }}
              >
                <ListItemText primary={category.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default CategoryList;
