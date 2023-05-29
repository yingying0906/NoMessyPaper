import { TextField, IconButton, Tooltip, Alert } from "@mui/material";
import { auth, db } from "../../firebase";
import { ref, set } from "firebase/database";

import * as React from "react";
import { AuthUserContext } from "../../auth/AuthUserContext";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import "./AccountPage.css";

const AccountPage = () => {
  const { apiKey, setApiKey } = React.useContext(AuthUserContext);

  const [apiKeyInput, setApiKeyInput] = React.useState("");

  const [apiKeyEdit, setApiKeyEdit] = React.useState(false);

  const { authUser } = React.useContext(AuthUserContext);

  React.useEffect(() => {
    setApiKeyInput(apiKey);
  }, [apiKey]);

  const handleApiKeyChange = (event) => {
    setApiKeyInput(event.target.value);
  };

  const [apiTipsOpen, setApiTipsOpen] = React.useState(false);

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
      <div className="accountPageContainer">
        <h2>Account Page</h2>
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            textAlign: "start",
            margin: "20px",
          }}
        >
          <>
            <h5 ls style={{ fontWeight: "bold" }}>
              Your SerpApi API Key{" "}
              <IconButton
                style={{ padding: "0" }}
                onClick={() => {
                  setApiTipsOpen(!apiTipsOpen);
                }}
              >
                <HelpOutlineIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </h5>
            {apiTipsOpen && (
              <Alert severity="info" style={{ borderRadius: "10px" }}>
                To enable search results, you need to provide your SerpApi API
                key. If you do not have an API key, you can get one from{" "}
                <a
                  href="https://serpapi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SerpApi
                </a>{" "}
                for free.
              </Alert>
            )}

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
                <Tooltip title="Save">
                  <IconButton
                    onClick={() => {
                      saveApiKey();
                      setApiKeyEdit(false);
                    }}
                  >
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => {
                      setApiKeyEdit(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
