import * as express from "express";
import * as bodyParser from "body-parser";
import config from "@shared/config";
import routes from "./routes";
import {MongoConnection} from "../database/mongodb/adapters/MongoConnection";
import { RabbitQueue } from "../messaging/adapters/rabbitQueue";

const isDynamoDatabase = config.NODE_ENV == "aws"
const isMongoDatabase = config.NODE_ENV == "production" || config.NODE_ENV == "debug"
console.log({isMongoDatabase})
const PORT = config.PORT || 3000;
const cors = require('cors');
const app = express();
const queue = RabbitQueue.Instance;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
queue.connect().then(() => {
  Object.entries(config.queue.queues)?.forEach(([key,value]) => {
    queue.addQueue(value);
  })
})

app.use(cors());

function configureRoutes() {
  app.use(routes);
  
  app.listen(PORT, () => {
    console.log(`Server escutando na porta ${PORT}`);
  });
}

async function configureMongo() {
  MongoConnection.props = {
    database: config.mongo.MONGO_DATABASE,
    user: config.mongo.MONGO_USER,
    password: config.mongo.MONGO_PW,
    port: +config.mongo.MONGO_PORT,
    host: config.mongo.MONGO_HOST
  };
  await MongoConnection.Instance.connect();
  configureRoutes()
}


async function bootstrap() {
  if(isMongoDatabase) return configureMongo()
  return configureRoutes();
}

bootstrap();
