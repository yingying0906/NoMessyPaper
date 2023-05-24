import "./NavBar.css";
import * as React from "react";
import { AppBar, Box, Toolbar, Container } from "@mui/material";

import UserSetting from "./component/UserSetting";
import { NavElement } from "./component/NavElement";
import { AuthUserContext } from "../../auth/AuthUserContext";

const NavBar = (props) => {
  const { authUser } = React.useContext(AuthUserContext);

  return (
    <div>
      <AppBar position="relative">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
              }}
            >
              <NavElement />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: "5px" }}>
                Welcome Back, {authUser ? authUser.email : "Guest"}
              </div>
              <UserSetting />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default NavBar;
