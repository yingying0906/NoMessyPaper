import "./AccountPage.css";

import SerpApiKey from "./component/SerpApiKey";

const AccountPage = () => {
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
          <SerpApiKey />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
