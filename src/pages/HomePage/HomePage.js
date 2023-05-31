import "./HomePage.css";
import * as React from "react";

import ReferenceTable from "./component/ReferenceTable/ReferenceTable";

import { ReferenceContext } from "../../database/ReferenceContext";
import { BackDropContext } from "./component/backDrop/BackDropContext";

import Backdrop from "@mui/material/Backdrop";
import AddReferenceBackDrop from "./component/backDrop/add/AddReferenceBackDrop";
import EditReferenceBackDrop from "./component/backDrop/edit/EditReferenceBackDrop";

import Grid from "@mui/material/Unstable_Grid2";
import CategoryList from "./component/CategoryList/CategoryList";

import { Skeleton } from "@mui/material";

const HomePage = () => {
  const [page, setPage] = React.useState("all");
  const { references, categories, loading } =
    React.useContext(ReferenceContext);

  const { openAdd, setOpenAdd, openEdit, setOpenEdit } =
    React.useContext(BackDropContext);

  const handleClose = (event) => {
    setOpenAdd(false);
    setOpenEdit(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };
  // rendering
  return (
    <div className="Homepage">
      <Grid container spacing={2}>
        <Grid xs={2}>
          {loading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <CategoryList
              handlePageChange={handlePageChange}
              page={page}
              setPage={setPage}
            />
          )}
        </Grid>
        <Grid xs={10}>
          {loading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <ReferenceTable references={references} page={page} />
          )}
        </Grid>
      </Grid>

      <>
        <Backdrop
          sx={{ color: "black", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openAdd}
          onClick={handleClose}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AddReferenceBackDrop handleClose={handleClose} />
          </div>
        </Backdrop>

        <Backdrop
          sx={{ color: "black", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openEdit}
          onClick={handleClose}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <EditReferenceBackDrop handleClose={handleClose} />
          </div>
        </Backdrop>
      </>
    </div>
  );
};

export default HomePage;
