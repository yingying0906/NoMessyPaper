import * as React from "react";

export const MarkDownContext = React.createContext();

const MarkDownContextProvider = (props) => {
  const [markdown, setMarkdown] = React.useState("");

  return (
    <MarkDownContext.Provider value={{ markdown, setMarkdown }}>
      {props.children}
    </MarkDownContext.Provider>
  );
};

export default MarkDownContextProvider;
