import sendResponse from "../utils/response.js";
const errorHandler = (err, req, res, next) => {
    // 👉 Add this line to see the exact stack trace in your terminal
    console.error("🔥 FULL ERROR TRACE:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    sendResponse(res, statusCode, false, message);
};
export default errorHandler;
