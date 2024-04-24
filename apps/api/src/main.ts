import cors, { CorsOptions } from 'cors';
import express, { Express } from 'express';
import dotenv from 'dotenv';

import { connectToDatabase } from './database/database.service';
import { setRoutes } from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions: CorsOptions = { exposedHeaders: 'Location' };
app.use(cors(corsOptions));

connectToDatabase()
  .then(() => {
    setRoutes(app);

    const server = app.listen(port, () => {
      console.log(`main: Listening at http://localhost:${port}/api`);
    });

    server.on('error', console.error);
  })
  .catch((error: Error) => {
    console.error('main: Database connection failed.', error);
    process.exit();
  });
