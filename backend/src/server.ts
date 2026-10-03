import app from "./app.js";
import { connectDatabase } from "./configs/database.js";
import { env } from "./configs/env.js";

async function startServer(): Promise<void> {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(
      `Server running at http://localhost:${env.port}`
    );
  });
}

startServer();