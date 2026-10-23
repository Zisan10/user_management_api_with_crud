import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes/user.route";

import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// app config
const app = express();
app.use(express.json());
app.use(cors());

// api endpoint use
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("user management api is working");
});

app.use("/api/user", router);
export default app;
