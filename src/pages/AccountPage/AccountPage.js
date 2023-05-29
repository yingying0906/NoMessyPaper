import { TextField, Button, IconButton, Icon } from "@mui/material";
import { auth, db } from "../../firebase";
import { ref, set } from "firebase/database";

import * as React from "react";
import { AuthUserContext } from "../../auth/AuthUserContext";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import "./AccountPage.css";

const AccountPage = () => {
  const { apiKey, setApiKey } = React.useContext(AuthUserContext);

  const [apiKeyInput, setApiKeyInput] = React.useState("");

  React.useEffect(() => {
    setApiKeyInput(apiKey);
  }, [apiKey]);

  const [apiKeyEdit, setApiKeyEdit] = React.useState(false);

  const { authUser } = React.useContext(AuthUserContext);

  const handleApiKeyChange = (event) => {
    setApiKeyInput(event.target.value);
  };

  const saveApiKey = () => {
    const user = auth.currentUser;
    if (user) {
      const uid = authUser.uid;
      const reference = ref(db, `/api-key/${uid}`);

      set(reference, apiKeyInput)
        .then(() => {
          console.log("API key saved");

          setApiKeyEdit(false);
          setApiKey(apiKeyInput);
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
          <>
            <p style={{ margin: "0" }}>
              To enable search results, you need to provide your SerpApi API
              key.
            </p>

            <div className="apiKeyInput">
              <TextField
                label="SerpApi API Key"
                value={apiKeyInput}
                onChange={handleApiKeyChange}
                fullWidth
                disabled={!apiKeyEdit}
                margin="normal"
              />
              {apiKeyEdit ? (
                <IconButton
                  onClick={() => {
                    saveApiKey();
                    setApiKeyEdit(false);
                  }}
                >
                  <SaveIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setApiKeyEdit(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </div>

            <div></div>
          </>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
