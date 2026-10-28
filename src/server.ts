import "dotenv/config";
import env from "./config/env.js";
import logger from "./shared/logger/logger.js";
import app from "./app.js";
// import { testDBConnection } from "./config/supabase_db.js";
// import connectDB from "./config/mongodb_db";
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    app.listen(env.port, () => {
      logger.info(` Server running on port ${PORT}`);
    });
  } catch (err: any) {
    logger.error("Failed to start server:", err);
  }
};

startServer();
