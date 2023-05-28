import * as React from "react";

import {
  Box,
  IconButton,
  Menu,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";

import { Link } from "react-router-dom";
import { AuthUserContext } from "../../../auth/AuthUserContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UserSetting = () => {
  const { authUser, userSignOut } = React.useContext(AuthUserContext);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <AccountCircleIcon fontSize="large" style={{ color: "white" }} />
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
          <Link to="/Account">
            <Button>Account</Button>
          </Link>
        </MenuItem>

        <MenuItem key="account" onClick={handleCloseUserMenu}>
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
  );
};

export default UserSetting;
