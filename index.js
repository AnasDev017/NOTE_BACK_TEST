import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import cors from "cors";
import DbCon from "./config/db.js";
import AuthRoutes from "./routes/Auth.js";
import NotesRoutes from "./routes/Notes.js";
import cookieParser from "cookie-parser";
dotenv.config();
const PORT = process.env.PORT;
const app = express();

DbCon();

// Read allowed origins from env (comma-separated) for flexibility in deployments
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || "";
const defaultOrigins = ["http://localhost:5173"];
const whitelist = allowedOriginsEnv
  ? allowedOriginsEnv.split(",").map((o) => o.trim())
  : defaultOrigins;

console.log("CORS whitelist:", whitelist);

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS, origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
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
    console.log(`App is ruuning on Port ${PORT}`);
  });
}

// Vercel ke liye Express app ko serverless handler ke taur par DEFAULT export karo
// (Vercel expects the default export to be a function or server)
export default serverless(app);
