const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
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

// Handler function for serverless function
const handler = (event, context, callback) => {
  const req = {
    ...event,
    url: event.path,
    path: event.path.split("/").slice(2).join("/"), // Removes "/.netlify/functions/" from the path
    headers: event.headers || {},
    query: event.multiValueQueryStringParameters || {},
    httpMethod: event.httpMethod,
  };

  const res = {
    setHeader: () => {},
    status: (statusCode) => {
      res.statusCode = statusCode;
      return res;
    },
    send: (body) => {
      callback(null, {
        statusCode: res.statusCode || 200,
        headers: res.headers,
        body: JSON.stringify(body),
      });
    },
  };

  app(req, res);
};

module.exports = { handler };
