import { useEffect, useState, createContext } from "react";

import { useNavigate } from "react-router-dom";

import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const AuthUserContext = createContext();

const AuthUserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  // change user
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      listen();
    };
  }, []);

  // signout
  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        alert("Signed out successfully");
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  // return
  const contextValue = {
    authUser,
    userSignOut,
  };
  return (
    <AuthUserContext.Provider value={contextValue}>
      {" "}
      {children}{" "}
    </AuthUserContext.Provider>
  );
};
export default AuthUserProvider;
