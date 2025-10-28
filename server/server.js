import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./routes/router.js";
import db from "./db.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, 
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

db.sync()
  .then(() => console.log("All models synchronized successfully."))
  .catch((err) => console.error("Error syncing models:", err));

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "sessionkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,       
      sameSite: "none",     
      secure: true,         
    },
  })
);

app.use("/", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Frontend allowed: ${process.env.FRONTEND_URL}`);
});
