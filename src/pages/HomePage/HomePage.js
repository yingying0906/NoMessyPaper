import "./HomePage.css";
import { writeNewReference } from "../../database/controlDatabase";
import { Button } from "@mui/material";
import RefTable from "./RefTable";

import { useContext, useEffect, useState } from "react";
import { AuthUserContext } from "../../auth/AuthUserContext";

import { ref, onValue, get } from "firebase/database";
import { db } from "../../firebase";

const HomePage = () => {
  const { authUser } = useContext(AuthUserContext);
  const [references, setReferences] = useState([]);

  useEffect(() => {
    const referenceRef = ref(db, `referenceList/${authUser?.uid}`);
    const handleChange = (snapshot) => {
      if (snapshot.exists()) {
        const referencesData = snapshot.val();
        const referencesArray = Object.keys(referencesData).map(
          (key, index) => ({
            id: key,
            fakeId: index + 1,
            ...referencesData[key],
          })
        );

        setReferences(referencesArray);
      } else {
        setReferences([]);
      }
    };
    const referenceListener = onValue(
      referenceRef,
      (snapshot) => {
        handleChange(snapshot);
      },
      {
        onlyOnce: false, // Add this option to prevent the null error
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      referenceListener(); // Unsubscribe from the listener
    };
  }, [authUser]);

  return (
    <div className="Homepage">
      <RefTable references={references} />
    </div>
  );
};

export default HomePage;
