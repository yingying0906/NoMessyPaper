import * as React from "react";
import { Typography } from "@mui/material";
import { AuthUserContext } from "../../../auth/AuthUserContext";
import { Link } from "react-router-dom";

import logo_2 from "../../../assets/logo_2.png";

const typographyData = [
  {
    text: null,
    href: "/",
    isVisible: { xs: "none", md: "flex" },
    extraStyles: { mr: 2 },
    isAuthRequired: false,
  },
  {
    text: "Add Multiple",
    href: "/Add",
    isVisible: { xs: "none", md: "flex" },
    extraStyles: { mr: 2 },
    isAuthRequired: true,
  },
  {
    text: "Search",
    href: "/Search",
    isVisible: { xs: "none", md: "flex" },
    extraStyles: { mr: 2 },
    isAuthRequired: true,
  },

  {
    text: "Manage",
    href: "/Home",
    isVisible: { xs: "none", md: "flex" },
    extraStyles: { mr: 2 },
    isAuthRequired: true,
  },
];

const NavElement = () => {
  const { authUser } = React.useContext(AuthUserContext);

  return (
    <>
      {typographyData.map((item, index) => {
        const { text, href, isVisible, extraStyles, isAuthRequired } = item;

        if (isAuthRequired && !authUser) {
          return null;
        }

        return (
          <Link
            key={index}
            to={href}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              key={index}
              variant="h6"
              noWrap
              sx={{
                ...extraStyles,
                display: isVisible,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {text}
              {!text && (
                <img
                  style={{ maxWidth: "150px", filter: "invert(1)" }}
                  src={logo_2}
                  alt="logo"
                  className="logo"
                />
              )}
            </Typography>
          </Link>
        );
      })}
    </>
  );
};

export { typographyData, NavElement };
