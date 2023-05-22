import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

import { auth, provider } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Google } from "@mui/icons-material";
import { signInWithPopup } from "firebase/auth";

import { useState, useContext } from "react";
import { AuthUserContext } from "../auth/AuthUserContext";

import LoginIcon from "@mui/icons-material/Login";

const SignIn = () => {
  const navigate = useNavigate();
  const { authUser } = useContext(AuthUserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Logged in successfully");
        navigate("/Home");
        console.log(userCredential);
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          alert("Wrong password");
          return;
        }
        if (error.code === "auth/user-not-found") {
          alert("User not found");
          return;
        }
        console.log(error);
      });
  };
  const signInGoogle = (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        alert("Logged in successfully");
        navigate("/Home");
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <form autoComplete="off" onSubmit={signIn}>
        <TextField
          disabled={authUser !== null}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="outlined"
          color="primary"
          type="email"
          sx={{
            mb: 2,
          }}
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
          sx={{
            mb: 2,
          }}
        />
        <Button
          disabled={authUser !== null}
          type="submit"
          variant="contained"
          startIcon={<LoginIcon />}
          fullWidth
          sx={{
            mb: 2,
          }}
        >
          Login
        </Button>
      </form>
      <Button
        disabled={authUser !== null}
        variant="outlined"
        startIcon={<Google />}
        fullWidth
        onClick={signInGoogle}
      >
        Login Using Google
      </Button>
    </div>
  );
};
export default SignIn;
