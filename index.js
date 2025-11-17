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

const whitelist = [
  "https://mern-note-app-frontend-zeta.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
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

// Vercel ke liye Express app ko serverless handler ke taur par export karo
export const handler = serverless(app);
