const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const HOST = "0.0.0.0";

const API_SERVICE_URL = "https://serpapi.com";

app.use(
  "/paper",
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/paper`]: "",
    },
  })
);

// Start Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
