import ServerlessHttp from "serverless-http";

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

const API_SERVICE_URL = "https://serpapi.com";

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

module.exports.handler = ServerlessHttp(app);
