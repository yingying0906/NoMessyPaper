import * as React from "react";
import { AuthUserContext } from "../../auth/AuthUserContext";
export const SearchInfoContext = React.createContext();

export const SearchInfoProvider = ({ children }) => {
  const [text, setText] = React.useState("");
  const [keywords, setKeywords] = React.useState("");

  const [fromYear, setFromYear] = React.useState("");
  const [searchFromYear, setSearchFromYear] = React.useState("");

  const [toYear, setToYear] = React.useState("");
  const [searchToYear, setSearchToYear] = React.useState("");

  const [numOfResults, setNumOfResults] = React.useState("10");
  const [searchNumOfResults, setSearchNumOfResults] = React.useState("10");

  const { authUser, setAuthUser } = React.useContext(AuthUserContext);

  const contextValue = {
    text,
    setText,
    keywords,
    setKeywords,
    fromYear,
    setFromYear,
    searchFromYear,
    setSearchFromYear,
    toYear,
    setToYear,
    searchToYear,
    setSearchToYear,
    numOfResults,
    setNumOfResults,
    searchNumOfResults,
    setSearchNumOfResults,
  };

  React.useEffect(() => {
    console.log("search page");
    if (!authUser) {
      console.log("authUser is null, clear search");
      setText("");
      setKeywords("");

      setFromYear("");
      setSearchToYear("");

      setToYear("");
      setSearchToYear("");

      setNumOfResults("10");
      setSearchNumOfResults("10");
    }
  }, [authUser, setAuthUser]);

  return (
    <SearchInfoContext.Provider value={contextValue}>
      {children}
    </SearchInfoContext.Provider>
  );
};

export default SearchInfoProvider;
