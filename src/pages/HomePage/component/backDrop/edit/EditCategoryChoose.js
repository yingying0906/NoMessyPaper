import * as React from "react";

import { Skeleton } from "@mui/material";
import { TextField, IconButton, FormGroup, Checkbox } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

import { AuthUserContext } from "../../../../../auth/AuthUserContext";
import { ReferenceContext } from "../../../../../database/ReferenceContext";

import { writeCategoriesDb } from "../../../../../database/controlCategory";

import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";

const EditCategoryChoose = () => {
  const { authUser } = React.useContext(AuthUserContext);

  const { categories, setCategories, loading } =
    React.useContext(ReferenceContext);
  const [newCategory, setNewCategory] = React.useState("");

  const handleCategoryChange = (index) => {
    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories[index] = {
        ...updatedCategories[index],
        checked: !updatedCategories[index].checked,
      };
      return updatedCategories;
    });
  };

  return (
    <>
      {loading ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <FormGroup>
          {categories.map((category, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={category.checked}
                  onChange={() => handleCategoryChange(index)}
                  name={category.name}
                />
              }
              label={category.name}
            />
          ))}
        </FormGroup>
      )}
    </>
  );
};

export default EditCategoryChoose;
