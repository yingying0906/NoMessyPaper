import * as React from "react";

const ReferenceContext = React.createContext(null);

//provider
export const ReferenceProvider = ({ children }) => {
  const [category, setCategory] = React.useState([]);

  const contextValue = {
    category,
    setCategory,
  };

  return (
    <ReferenceContext.Provider value={contextValue}>
      {children}
    </ReferenceContext.Provider>
  );
};

export default ReferenceContext;
