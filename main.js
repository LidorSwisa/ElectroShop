const { server, wsServer, app } = require("./app");

require("dotenv").config({ path: "./.env.dev" });
const port = process.env.PORT || 8080;
const db = require("./database");
const Category = require("./models/category.model");
const clients = require("./clients");
app.get("/", (req, res) => {
  res.render("master", {
    title: "Home Page",
    contentFile: "index",
    dynamicContent: "This is dynamic content for the home page",
  });
});

app.get("/:name", (req, res) => {
  res.render("master", {
    title: "Home Page",
    contentFile: req.params.name ?? "index",
    dynamicContent: "This is dynamic content for the home page",
  });
});

wsServer.on("connection", (ws) => {
  clients.push(ws);
  ws.on("close", () => {
    clients.splice(clients.indexOf(ws), 1);
  });
});

wsServer.on("listening", () => {
  console.log("WebSocket server is listening");
});
server.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  db.then(async () => {
    console.log("MongoDB Connected");
  });
});