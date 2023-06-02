import "./NavBar.css";
import * as React from "react";
import { AppBar, Box, Toolbar, Container } from "@mui/material";

import UserSetting from "./component/UserSetting";
import { NavElement } from "./component/NavElement";
import { AuthUserContext } from "../../auth/AuthUserContext";

const NavBar = (props) => {
	const { authUser } = React.useContext(AuthUserContext);

	return (
		<AppBar position="sticky" style={{ padding: "0px 20px" }}>
			<Toolbar disableGutters>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						flex: "1 0 auto",
					}}
				>
					<NavElement />
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						flex: "1 0 auto",
						justifyContent: "flex-end",
					}}
				>
					<div style={{ marginRight: "5px" }}>
						Welcome Back, {authUser ? authUser.email : "Guest"}
					</div>
					<UserSetting />
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default NavBar;
