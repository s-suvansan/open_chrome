const express = require("express");
const { exec } = require("child_process");

const app = express();
const port = 3000;

app.use(express.json());
// Options to specify the application (Chrome) to be used

app.post("/open-chrome", (req, res) => {
  const url = req.body.url || "http://example.com"; // Default URL if not provided in the request body
  const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe"; // Update this path as necessary
  const command = `start chrome "${url}"`;

  // macOS:
  // const command = `open -a "Google Chrome" "${url}"`;

  // Linux:
  // const command = `google-chrome "${url}"`;

  // Execute the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening Chrome: ${error}`);
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
