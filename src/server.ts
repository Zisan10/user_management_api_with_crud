import "dotenv/config";
import app from "./app";
import prisma from "./config/prisma";

const port = Number(process.env.PORT) || 4000;

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("DB is connected");

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();