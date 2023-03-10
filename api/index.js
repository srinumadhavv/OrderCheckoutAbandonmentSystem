import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { trim_all } from "request_trimmer";
import { checkout,order } from "./functions.js";
// declaring application
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(trim_all);

app.post('/api/checkout',checkout);

app.post('/api/order',order);

const handler = serverless(app);
export { handler };
