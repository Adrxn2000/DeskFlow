const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;