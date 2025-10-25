import express from 'express'
import playersRouter from './routes/players';
import axios from 'axios';

const app = express()

const PORT = 3000;

app.use("/api/players", playersRouter);

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});