const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/open-chrome", (req, res) => {
  const url = req.body.url || "http://example.com"; // Default URL if not provided in the request body
  const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe"; // Update this path as necessary

  // Properly wrap the URL in quotes to handle special characters
  exec(`"${chromePath}" "${url}"`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error opening Chrome: ${err}`);
      res.status(500).send("Error opening Chrome");
      return;
    }
    console.log(`Chrome opened: ${stdout}`);
    res.send("Chrome opened successfully");
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
