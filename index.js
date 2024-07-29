const WebSocket = require("ws");
const express = require("express");

const app = express();
const port = 3000;
const wss = new WebSocket.Server({ noServer: true });

let wsClient = null;
let pendingResponse = null;

wss.on("connection", (ws) => {
  console.log("Client connected");
  wsClient = ws;

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    if (pendingResponse) {
      pendingResponse.send(message);
      pendingResponse = null; // Clear the pending response
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    wsClient = null;
  });
});

const server = app.listen(port, () => {
  console.log(`Server running in live`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

app.use(express.json());

app.post("/open-chrome", (req, res) => {
  const url = req.body.url;
  const platform = req.body.platform || "windows";
  // const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe"; // Update this path as necessary
  const command = `start chrome "${url}"`;

  if (platform == "windows") {
    command = `start chrome "${url}"`;
  } else if (platform == "macos") {
    command = `open -a "Google Chrome" "${url}"`;
  } else if (platform == "linux") {
    command = `google-chrome "${url}"`;
  }
  // "${chromePath}" "${url}"
  require("child_process").exec(command, (err) => {
    if (err) {
      console.error(`Error opening Chrome: ${err}`);
      res.status(500).send("Error opening Chrome");
      return;
    }
    // res.send("Chrome opened successfully");
    pendingResponse = res;
  });
});

app.post("/send-to-client", (req, res) => {
  const message = req.body.message;
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    wsClient.send(message);
    res.send("Message sent to client");
  } else {
    res.status(400).send("No connected client");
  }
});
