import * as React from "react";
import { db } from "../firebase";
import { ref, push, get, onValue } from "firebase/database";

import { AuthUserContext } from "../auth/AuthUserContext";
export const ReferenceContext = React.createContext();

//provider
export const ReferenceProvider = ({ children }) => {
  // category
  const [categories, setCategories] = React.useState([]);
  const { authUser } = React.useContext(AuthUserContext);

  const writeCategoriesDb = (uid, categories) => {
    const reference = ref(db, "categories/" + uid);
    push(reference, categories);
  };

  React.useEffect(() => {
    if (authUser) {
      // get categories
      const categoriesRef = ref(db, `/categories/${authUser.uid}`);
      get(categoriesRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const categories = [];
            for (const [key, value] of Object.entries(snapshot.val())) {
              categories.push({ name: value, checked: false });
            }
            setCategories(categories);

            console.log("categories retrieved");
          } else {
            console.log("no categories");
          }
        })
        .catch((error) => {
          console.error("Error retrieving categories:", error);
        });
    }
  }, [authUser]);

  // reference
  const [references, setReferences] = React.useState([]);

  React.useEffect(() => {
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
        onlyOnce: false,
      }
    );

    // Clean up the listener
    return () => {
      referenceListener();
    };
  }, [authUser, setReferences]);

  const contextValue = {
    categories,
    setCategories,
    writeCategoriesDb,
    references,
    setReferences,
  };

  return (
    <ReferenceContext.Provider value={contextValue}>
      {children}
    </ReferenceContext.Provider>
  );
};

export default ReferenceProvider;
