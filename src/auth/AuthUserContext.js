import * as React from "react";

import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";

export const AuthUserContext = React.createContext();

const AuthUserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = React.useState(null);
  const [apiKey, setApiKey] = React.useState("");

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

  React.useEffect(() => {
    if (authUser) {
      const uid = authUser.uid;
      const apiRef = ref(db, `/api-key/${uid}`);

      get(apiRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setApiKey(snapshot.val());
            console.log("API key retrieved");
          } else {
          }
        })
        .catch((error) => {
          console.error("Error retrieving API key:", error);
        });
    }
  }, [authUser, setAuthUser]);

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
    apiKey,
    setApiKey,
  };
  return (
    <AuthUserContext.Provider value={contextValue}>
      {children}
    </AuthUserContext.Provider>
  );
};
export default AuthUserProvider;
