import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],

    // 🔐 JWT Authorization
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        },
      },
    },

    // make JWT required by default
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // 👇 important: where swagger reads comments from
  apis: ["src/Modules/**/*.ts", "dist/Modules/**/*.js"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
