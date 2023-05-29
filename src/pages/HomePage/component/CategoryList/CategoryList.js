import * as React from "react";

import { ReferenceContext } from "../../../../database/ReferenceContext";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Divider, IconButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ModeOutlinedIcon from "@mui/icons-material/ModeOutlined";

const CategoryList = ({ handlePageChange }) => {
  const { categories } = React.useContext(ReferenceContext);
  const [selectedIndex, setSelectedIndex] = React.useState("all");

  return (
    <div style={{ textAlign: "left" }}>
      <List>
        <ListItem disablePadding key={-1}>
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
            <>
              <Divider key={index} />
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
            </>
          );
        })}
      </List>
    </div>
  );
};

export default CategoryList;
