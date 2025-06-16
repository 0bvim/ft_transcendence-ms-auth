import dotenv from "dotenv";
import { Config } from "../types/common.types";

// Load environment variables
dotenv.config();

const requiredEnvVars = [
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "DATABASE_URL",
];

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config: Config = {
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: process.env.API_PREFIX || "/api/v1",
  projectName: process.env.PROJECT_NAME || "Unknown",

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },

  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "60000", 10),
  },

  database: {
    url: process.env.DATABASE_URL!,
  },
};

// Log configuration in development
if (config.nodeEnv === "development") {
  console.log("🔧 Configuration loaded:", {
    port: config.port,
    nodeEnv: config.nodeEnv,
    apiPrefix: config.apiPrefix,
    corsOrigin: config.cors.origin,
    jwtAccessExpiresIn: config.jwt.accessExpiresIn,
    jwtRefreshExpiresIn: config.jwt.refreshExpiresIn,
    rateLimitMax: config.rateLimit.max,
    rateLimitWindow: config.rateLimit.windowMs,
  });
}
