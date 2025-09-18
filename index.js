import dotenv from "dotenv";
import express from "express";
const app = express();
import cors from "cors";
dotenv.config();
import ConnectDb from "./config/db.js";
import routes from "./routes/index.js";

const PORT = process.env.PORT || 4000; 

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use("/api/v1", routes);

ConnectDb();
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});