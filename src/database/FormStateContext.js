import * as React from "react";
import { AuthUserContext } from "../auth/AuthUserContext";
export const FormStateContext = React.createContext();

export const FormStateProvider = ({ children }) => {
  const { authUser, setAuthUser } = React.useContext(AuthUserContext);
  const [formState, setFormState] = React.useState({
    author: "",
    title: "",
    year: "",
    journal: "",
    tags: "",
    selectedFile: null,
    link: "",
  });

  React.useEffect(() => {
    if (!authUser) {
      console.log("no auth user or logout, clear form state");
      setFormState({
        author: "",
        title: "",
        year: "",
        journal: "",
        tags: "",
        selectedFile: null,
        link: "",
      });
    }
  }, [authUser, setAuthUser]);

  return (
    <FormStateContext.Provider value={{ formState, setFormState }}>
      {children}
    </FormStateContext.Provider>
  );
};

export default FormStateProvider;
