require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
let swaggerDocument = require("./swagger/swagger.json");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "public")));

// Routes
app.use(require("./routes/dev"));
app.use("/auth", require("./routes/auth"));
app.use("/tour", require("./routes/tour"));
app.use("/basket", require("./routes/basket"));
app.use("/user", require("./routes/user"));
app.use("/order", require("./routes/order"));

app.get("/", (req, res) => {
  res.send("Welcome to the Tour and Travel Agency API!");
});

// Server config
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// Environment check
const isProduction = process.env.NODE_ENV === "production";
const domain = process.env.APP_URL || `http://localhost:${PORT}`;

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);

  // Update Swagger server info
  swaggerDocument.servers = [
    {
      url: domain,
      description: isProduction ? "Production server" : "Local server",
    },
  ];

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`📖 Swagger API docs are available at ${domain}/api-docs`);
});
