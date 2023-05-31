import * as React from "react";
import { db } from "../firebase";
import { ref, push, get, onValue, set } from "firebase/database";

import { AuthUserContext } from "../auth/AuthUserContext";
export const ReferenceContext = React.createContext();

export const ReferenceProvider = ({ children }) => {
  const { authUser } = React.useContext(AuthUserContext);

  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (authUser) {
      setLoading(true);

      const categoriesRef = ref(db, `/categories/${authUser.uid}`);

      const handleCategoriesChange = (snapshot) => {
        if (snapshot.exists()) {
          const categories = [];
          for (const [key, value] of Object.entries(snapshot.val())) {
            categories.push({ name: value, checked: false, refID: key });
          }
          setCategories(categories);

          console.log("categories retrieved");
        } else {
          console.log("no categories");
        }
      };

      const categoriesListener = onValue(
        categoriesRef,
        (snapshot) => {
          handleCategoriesChange(snapshot);
        },
        {
          onlyOnce: false,
        }
      );
      return () => {
        categoriesListener();
      };
    }
  }, [authUser]);

  // reference
  const [references, setReferences] = React.useState([]);

  React.useEffect(() => {
    const referenceRef = ref(db, `referenceList/${authUser?.uid}`);

    const handleReferenceChange = (snapshot) => {
      setLoading(true);
      if (snapshot.exists()) {
        console.log("new ref");
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

      setLoading(false);
    };
    const referenceListener = onValue(
      referenceRef,
      (snapshot) => {
        handleReferenceChange(snapshot);
      },
      {
        onlyOnce: false,
      }
    );

    // Clean up the listener
    return () => {
      referenceListener();
    };
  }, [authUser]);

  const contextValue = {
    categories,
    setCategories,
    references,
    setReferences,
    loading,
    setLoading,
  };

  return (
    <ReferenceContext.Provider value={contextValue}>
      {children}
    </ReferenceContext.Provider>
  );
};

export default ReferenceProvider;
