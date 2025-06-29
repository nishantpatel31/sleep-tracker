import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sleep Tracker API",
      version: "1.0.0",
      description: "API docs for user onboarding and sleep tracking",
    },
    servers: [{ url: "http://localhost:4000" }],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"], // Scan these for annotations
};

export default swaggerJSDoc(options);
