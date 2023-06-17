import * as express from "express";
import * as bodyParser from "body-parser";
import config from "@shared/config";
import routes from "./routes";
import MongoConnection from "../database/mongodb/adapters/MongoConnection";

const PORT = config.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function bootstrap() {
  if(config.NODE_ENV == 'production') {
    const client = new MongoConnection({
      database: config.mongo.MONGO_DATABASE,
      user: config.mongo.MONGO_USER,
      password: config.mongo.MONGO_PW,
      port: +config.mongo.MONGO_PORT,
    });
    await client.connect();
  }
  app.use(routes);

  app.listen(PORT, () => {
    console.log(`Server escutando na porta ${PORT}`);
  });
}

bootstrap();
