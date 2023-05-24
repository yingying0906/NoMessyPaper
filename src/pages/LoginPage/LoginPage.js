import * as React from "react";
import { Box } from "@mui/material";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import "./LoginPage.css";
import SignIn from "../../auth/SignIn";
import SignUp from "../../auth/SignUp";

const LoginPage = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="LoginPage">
      <div className="AccountTab">
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Log In" value="1" />
              <Tab label="Sign Up" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <h3>Log In</h3>
            <SignIn />
          </TabPanel>
          <TabPanel value="2">
            <h3>Create Account</h3>
            <SignUp />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

export default LoginPage;
