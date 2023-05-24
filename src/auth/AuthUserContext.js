import * as React from "react";

import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const AuthUserContext = React.createContext();

const AuthUserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = React.useState(null);

  // change user once auth state changes
  React.useEffect(() => {
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

  // return context
  const contextValue = {
    authUser,
    userSignOut,
  };
  return (
    <AuthUserContext.Provider value={contextValue}>
      {children}
    </AuthUserContext.Provider>
  );
};
export default AuthUserProvider;
