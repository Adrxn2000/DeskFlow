const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DeskFlow API",
      version: "1.0.0",
      description: "Internal IT Service Request Portal — REST API for ticket submission, listing, and resolution.",
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);