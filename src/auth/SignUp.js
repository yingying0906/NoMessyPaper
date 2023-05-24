import * as React from "react";
import { TextField, Button } from "@mui/material";

import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthUserContext } from "../auth/AuthUserContext";

const SignUp = () => {
  const { authUser } = React.useContext(AuthUserContext);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const signUp = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Account created successfully");
        navigate("/Home");
        console.log(userCredential);
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("Email already in use");
          return;
        }
        console.log(error);
      });
  };
  return (
    <div>
      <form autoComplete="off" onSubmit={signUp}>
        <TextField
          disabled={authUser !== null}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="outlined"
          color="primary"
          type="email"
          sx={{ mb: 2 }}
          fullWidth
          value={email}
        />
        <TextField
          disabled={authUser !== null}
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="outlined"
          color="primary"
          type="password"
          value={password}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Button
          disabled={authUser !== null}
          type="submit"
          variant="contained"
          style={{ width: "100%" }}
        >
          SignUp
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
