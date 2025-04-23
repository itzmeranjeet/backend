import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.PORT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // for limiting to accept data from json
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Used when data is coming from the URL. 'extended: true' allows nested objects (i.e., objects within objects) to be parsed.
app.use(express.static("public")); // for if we want store image/file / // Serves static files like images or other assets from the 'public' directory.
app.use(cookieParser()); // cookieParser is used when we want to set or access cookies from the server in the browser.

export { app };
