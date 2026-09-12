import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import httpLogger from "./shared/logger/httpLogger.js";
import errorHandler from "./shared/errors/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./modules/auth/authRoutes.js";
import swaggerSpec from "./config/swagger.js";
import userRoutes from "./modules/user/userRoutes.js";
import caseRoutes from "./modules/case/caseRoutes.js";
import groupRoutes from "./modules/group/groupRoutes.js";
import channelRoutes from "./modules/group/channelRoutes.js";
import commentRoutes from "./modules/comment/commentRoutes.js";
import theoryRoutes from "./modules/theory/theoryRoutes.js";
import notificationRoutes from "./modules/notification/notificationRoutes.js";
import reportRoutes from "./modules/report/reportRoutes.js";
import adminRoutes from "./modules/admin/adminRoutes.js";
import moderationRoutes from "./modules/moderation/moderationRoutes.js";
const app = express();
app.use(httpLogger);
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));
const swaggerCustomCss = `
  body {
    background-color: #0000;
  }
  .swagger-ui {
    filter: invert(88%) hue-rotate(180deg);
  }
  .swagger-ui .microlight {
    filter: invert(100%) hue-rotate(180deg);
  }
  .swagger-ui .topbar {
    display: none;
  }
  .swagger-ui .btn.authorize {
    border-color: #6366f1;
    color: #6366f1;
  }
  .swagger-ui .btn.authorize svg {
    fill: #6366f1;
  }
  .swagger-ui .opblock-tag {
    border-bottom: 1px solid #6366f1;
  }
  .swagger-ui .opblock.opblock-post {
    border-color: #6366f1;
    background: #000000;
  }
  .swagger-ui .opblock.opblock-post .opblock-summary-method {
    background-color: #6366f1;
  }
  .swagger-ui .opblock.opblock-get .opblock-summary-method {
    background-color: #6366f1;
    filter: brightness(1.3);
  }
  .swagger-ui .scheme-container {
    background-color: #000000;
    box-shadow: none;
  }
`;
app.use(cors({
    origin: ["http://localhost:3000", "http://192.168.0.105:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// app.use(xss());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: swaggerCustomCss,
    customSiteTitle: "Express API Docs",
}));
app.get("/", (req, res) => {
    res.send("right endpoint");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/theories", theoryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/moderation", moderationRoutes);
app.use(errorHandler);
export default app;
