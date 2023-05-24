import * as React from "react";
import "./IntroPage.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthUserContext } from "../../auth/AuthUserContext";

import homeimg from "../../assets/homeImg.png";

const IntroPage = (props) => {
  const { authUser } = React.useContext(AuthUserContext);

  return (
    <div className="IntroPage">
      <div className="IntroPageFlex">
        <div className="IntroPageFlexLeft">
          <h1>NoMessyPaper</h1>

          <h6>
            Conduct research effortlessly, manage your research paper, take
            notes for your paper, and organize your scattered thoughts. Let's
            get started.
          </h6>
          <Link to={authUser ? "/Home" : "/Login"}>
            <Button variant="contained" color="primary">
              Get started
            </Button>
          </Link>
        </div>
        <div className="IntroPageFlexRight">
          <img src={homeimg} alt="homeimg" id="homeimg" />
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
