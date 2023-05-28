const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

console.log("server.js running");
const API_SERVICE_URL =
  "https://serpapi.com/searches/bb6e2fcc452dcb5b/6464ec487f8361e3061a9c72.json";

app.use(
  "/paper",
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/paper": "",
    },
  })
);

module.exports = app;
