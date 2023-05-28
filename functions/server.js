// 需要安裝
// npm install express
// npm install http-proxy-middleware
// npm install cors
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3001;
const HOST = "localhost";

// const API_SERVICE_URL = "https://scholar.google.com.tw";  // => => text/html  我不知道能不能轉json檔

// 已有的json連結 ( if switch API_SERVICE_URL => need to reflash the page of  " localhost:3001/paper "  )
// const API_SERVICE_URL = "https://serpapi.com/searches/172a96ae7633efa9/646500d0660dbdf721502d3c.json";
//const API_SERVICE_URL = "https://serpapi.com/searches/bb6e2fcc452dcb5b/6464ec487f8361e3061a9c72.json";

// serpapi ( if switch API_SERVICE_URL => need to reflash the page of  " localhost:3001/paper "  ) =>
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
