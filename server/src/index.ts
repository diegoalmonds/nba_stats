import express from 'express'
import playersRouter from './routes/players';
import cors from "cors";

const app = express()

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true,               // if you need cookies/auth
}));

const PORT = 3000;

app.use("/api/players", playersRouter);

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});