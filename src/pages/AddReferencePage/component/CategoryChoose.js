import * as React from "react";

import { Skeleton } from "@mui/material";
import { TextField, IconButton, FormGroup, Checkbox } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

import { AuthUserContext } from "../../../auth/AuthUserContext";
import { ReferenceContext } from "../../../database/ReferenceContext";

import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";

const CategoryChoose = () => {
  const { authUser } = React.useContext(AuthUserContext);

  const { categories, setCategories, writeCategoriesDb, loading } =
    React.useContext(ReferenceContext);
  const [newCategory, setNewCategory] = React.useState("");
  const [openNewCategory, setOpenNewCategory] = React.useState(false);

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

  const addCategory = (catName, refID) => {
    setCategories((prevCategories) => [
      ...prevCategories,
      { name: `${catName}`, checked: false, refID: refID },
    ]);
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

      {openNewCategory && !loading ? (
        <div className="newCategory">
          <TextField
            size="small"
            label="Category Name"
            onChange={(e) => setNewCategory(e.target.value)}
            required
            variant="outlined"
            color="primary"
            type="text"
            sx={{
              mb: 2,
            }}
            fullWidth
            value={newCategory}
          />
          <IconButton
            onClick={() => {
              if (newCategory === "") {
                alert("Please enter a category name");
                return;
              }

              setOpenNewCategory(false);
              const refId = writeCategoriesDb(authUser.uid, newCategory);
              console.log("add ", refId);
              addCategory(newCategory, refId);
              setNewCategory("");
            }}
          >
            <DoneIcon />
          </IconButton>
        </div>
      ) : (
        <IconButton onClick={() => setOpenNewCategory(true)}>
          <AddIcon />
        </IconButton>
      )}
    </>
  );
};

export default CategoryChoose;
