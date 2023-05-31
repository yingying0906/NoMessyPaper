import * as React from "react";

export const FormStateContext = React.createContext();

export const FormStateProvider = ({ children }) => {
  const [formState, setFormState] = React.useState({
    author: "",
    title: "",
    year: "",
    journal: "",
    tags: "",
    selectedFile: null,
    link: "",
  });

  return (
    <FormStateContext.Provider value={{ formState, setFormState }}>
      {children}
    </FormStateContext.Provider>
  );
};

export default FormStateProvider;
