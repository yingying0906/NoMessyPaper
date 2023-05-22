import "./NavBar.css";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";

import { Link } from "react-router-dom";

import { useState, useContext } from "react";
import { AuthUserContext } from "../../auth/AuthUserContext";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

const NavBar = (props) => {
  const { authUser, userSignOut } = useContext(AuthUserContext);
  // bar
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div>
      <AppBar position="relative">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <HistoryEduIcon
              fontSize="large"
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              NoMessyPaper
            </Typography>
            <Box
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            ></Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {authUser && (
                <>
                  <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href={"/Add"}
                    sx={{
                      mr: 2,
                      display: { xs: "none", md: "flex" },
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    Add Multiple
                  </Typography>
                  <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href={"/Home"}
                    sx={{
                      mr: 2,
                      display: { xs: "none", md: "flex" },
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    Manage
                  </Typography>
                </>
              )}
            </Box>
            <div style={{ marginRight: "5px" }}>
              Welcome Back, {authUser ? authUser.email : "Guest"}
            </div>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircleIcon
                    fontSize="large"
                    style={{ color: "white" }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key="logout" onClick={handleCloseUserMenu}>
                  {authUser ? (
                    <Button onClick={userSignOut}>Logout</Button>
                  ) : (
                    <Link to="/Login">
                      <Button>Login</Button>
                    </Link>
                  )}
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default NavBar;
