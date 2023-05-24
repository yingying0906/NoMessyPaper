import * as React from "react";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ManualReferenceFill from "../../../../AddReferencePage/component/ManualReferenceFill";
import BibtexReference from "../../../../AddReferencePage/component/BibtexReference";

const AddReferenceBackDrop = (props) => {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div
      style={{
        width: "40vw",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Plain Text" value="1" />
            <Tab label="Bibtex" value="2" />
          </TabList>
          <IconButton onClick={props.handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TabPanel value="1">
          <h3 style={{ textAlign: "start" }}>Plain Text</h3>
          <ManualReferenceFill />
        </TabPanel>
        <TabPanel value="2">
          <h3 style={{ textAlign: "start" }}>Bibtex</h3>
          <BibtexReference />
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default AddReferenceBackDrop;
