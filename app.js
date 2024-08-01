const express = require("express");
const path = require("path");
const cors = require("cors");
const authRouter = require("./routes/auth.route");
const adminRouter = require("./routes/admin.route");
const imageUploadRouter = require("./routes/imageupload.route");
const http = require("http");
const orderRouter = require("./routes/order.route");
const branchesRouter = require("./routes/branches.route");
const cartRouter = require("./routes/cart.route");
const productsRouter = require("./routes/product.route");
const favicon = require("serve-favicon");
const authMiddleware = require("./middleware/auth.middleware");
const adminMiddleware = require("./middleware/admin.middleware");
const { WebSocketServer } = require("ws");

require("dotenv").config({ path: "./.env.dev" });

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use("/static", express.static("public"));
app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/admin", authMiddleware, adminMiddleware, adminRouter);
app.use("/imageupload", imageUploadRouter);
app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/order", authMiddleware, orderRouter);
app.use("/cart", authMiddleware, cartRouter);
app.use("/branches", branchesRouter);

const wsServer = new WebSocketServer({ server });

module.exports = {
  server,
  wsServer,
  app
};
