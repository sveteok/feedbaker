"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = require("./middleware/cors");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const sites_1 = __importDefault(require("./routes/sites"));
const feedback_1 = __importDefault(require("./routes/feedback"));
const users_1 = __importDefault(require("./routes/users"));
const db_1 = require("./models/db");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const requiredEnvVars = ["COOKIE_NAME", "GOOGLE_CLIENT_ID", "JWT_SECRET"];
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.options("/api/feedback", cors_1.publicCors);
app.options(/^(?!\/api\/feedback).*/, cors_1.restrictedCors);
app.use("/api/auth", cors_1.restrictedCors, auth_1.default);
app.use("/api/profile", cors_1.restrictedCors, profile_1.default);
app.use("/api/sites", cors_1.restrictedCors, sites_1.default);
app.use("/api/feedback", cors_1.publicCors, feedback_1.default);
app.use("/api/users", cors_1.restrictedCors, users_1.default);
app.use(errorHandler_1.errorHandler);
const port = process.env.PORT || 8080;
async function startServer() {
    const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
    if (missingEnvVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
    }
    await (0, db_1.createTables)();
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
startServer().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
});
