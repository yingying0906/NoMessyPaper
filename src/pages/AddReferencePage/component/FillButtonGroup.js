import {
  TextField,
  Button,
  IconButton,
  FormGroup,
  Checkbox,
  ButtonGroup,
} from "@mui/material";

import * as React from "react";
import { AuthUserContext } from "../../../auth/AuthUserContext";

const FillButtonGroup = ({ clearFill, isValid }) => {
  const { authUser } = React.useContext(AuthUserContext);

  return (
    <ButtonGroup
      style={{ width: "50%" }}
      variant="outlined"
      aria-label="outlined button group"
    >
      <Button
        fullWidth
        disabled={authUser == null || !isValid}
        type="submit"
        variant="outlined"
        sx={{
          mb: 2,
        }}
      >
        Submit
      </Button>

      <Button
        fullWidth
        disabled={authUser == null}
        variant="outlined"
        color="error"
        onClick={clearFill}
        sx={{
          mb: 2,
        }}
      >
        Reset
      </Button>
    </ButtonGroup>
  );
};

export default FillButtonGroup;
