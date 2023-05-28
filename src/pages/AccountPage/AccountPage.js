import { TextField, Button } from "@mui/material";
import { auth, db } from "../../firebase";
import { ref, set } from "firebase/database";

import * as React from "react";
import { AuthUserContext } from "../../auth/AuthUserContext";

import "./AccountPage.css";

const AccountPage = () => {
  const [apiKey, setApiKey] = React.useState("");
  const { authUser } = React.useContext(AuthUserContext);

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const saveApiKey = () => {
    const user = auth.currentUser;
    if (user) {
      const uid = authUser.uid;
      const reference = ref(db, `/api-key/${uid}`);

      set(reference, apiKey)
        .then(() => {
          console.log("API key saved");
        })
        .catch((error) => {
          console.error("Error saving API key:", error);
        });
    }
  };

  return (
    <div>
      <h2>Account Page</h2>
      <div className="accountPageContainer">
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            textAlign: "start",
          }}
        >
          <h5 style={{ fontWeight: "bold" }}>Your SerpApi API Key</h5>
          <p style={{ margin: "0" }}>
            To enable search results, you need to provide your SerpApi API key.
          </p>
          <TextField
            label="SerpApi API Key"
            value={apiKey}
            onChange={handleApiKeyChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={saveApiKey}>
            Save API Key
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
