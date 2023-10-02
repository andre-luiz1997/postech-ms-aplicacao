import * as express from "express";
import * as bodyParser from "body-parser";
import config from "@shared/config";
import routes from "./routes";
import {MongoConnection} from "../database/mongodb/adapters/MongoConnection";

const PORT = config.PORT || 3000;
var cors = require('cors');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

function configureRoutes() {
  app.use(routes);
  
  app.listen(PORT, () => {
    console.log(`Serverr escutando na porta ${PORT}`);
  });
}

async function bootstrap() {
  if(config.NODE_ENV == 'production' || config.NODE_ENV == 'debug') {
    const client = new MongoConnection({
      database: config.mongo.MONGO_DATABASE,
      user: config.mongo.MONGO_USER,
      password: config.mongo.MONGO_PW,
      port: +config.mongo.MONGO_PORT,
      host: config.mongo.MONGO_HOST
    });
    return client.connect().then(() => configureRoutes())
  }
  return configureRoutes();
}

bootstrap();
