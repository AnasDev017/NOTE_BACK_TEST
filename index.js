import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import cors from "cors";
import DbCon from "./config/db.js";
import AuthRoutes from "./routes/Auth.js";
import NotesRoutes from "./routes/Notes.js";
import cookieParser from "cookie-parser";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

DbCon();

// Read allowed origins from env (comma-separated) for flexibility in deployments
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || "";
const defaultOrigins = ["http://localhost:5173","https://note-front-test.vercel.app"];
const whitelist = allowedOriginsEnv
  ? allowedOriginsEnv.split(",").map((o) => o.trim())
  : defaultOrigins;

const isDev = process.env.NODE_ENV !== "production";
console.log("CORS whitelist:", whitelist, "isDev:", isDev);

// If in development, allow localhost origins to avoid CORS friction.
// In production, enforce the whitelist strictly.
app.use(
  cors({
    credentials: true,
    // Respond to preflight with 200 to avoid some browser quirks
    optionsSuccessStatus: 200,
    origin: function (origin, callback) {
      // allow requests with no origin (like curl, Postman)
      if (!origin) return callback(null, true);
      // in dev allow any localhost origins to simplify testing
      if (isDev && origin.includes("localhost")) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      console.error("Blocked by CORS, origin:", origin);
      // Instead of throwing an error (which results in no CORS headers), return a friendly failure
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

// Ensure OPTIONS preflight routes are handled
app.options("*", cors());
app.use(cookieParser());
app.use(express.json());
app.use("/auth", AuthRoutes);
app.use("/notes", NotesRoutes);

app.get("/", (req, res) => {
  res.send("hello from backend");
});

// Local development ke liye
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`);
  });
}

// Vercel ke liye Express app ko serverless handler ke taur par DEFAULT export karo
// (Vercel expects the default export to be a function or server)
export default serverless(app);
