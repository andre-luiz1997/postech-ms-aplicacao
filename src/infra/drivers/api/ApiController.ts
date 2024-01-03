import config from "@shared/config";
import { ClienteController } from "@domain/cliente/controllers/ClienteController"
import { ItemController } from "@domain/item/controllers/ItemController"
import { ClienteMongoRepository } from "@infra/database/mongodb/cliente/repositories/clientesMongo.repository"
import { ItemMongoRepository } from "@infra/database/mongodb/item/repositories/itensMongo.repository"
import { ClienteMemoriaRepository } from "src/infra/database/memory/cliente/repositories/clientesMemoria.repository"
import { ItemMemoriaRepository } from "src/infra/database/memory/item/repositories/itemMemoria.repository"
import { ItemDynamoRepository } from "src/infra/database/dynamodb/localstack/item/repositories/itemDynamo.repository";
import { ClienteDynamoRepository } from "src/infra/database/dynamodb/localstack/cliente/repositories/clientesDynamo.repository";

export class ApiController {
  private static instance: ApiController
  clienteController: ClienteController
  itemController: ItemController

  constructor() {
    const isDynamoDatabase = config.NODE_ENV == "aws"
    const isMongoDatabase = config.NODE_ENV == "production" || config.NODE_ENV == "debug"

    let clienteRepo
    let itemRepo
    let pedidoRepo
    let pagamentosRepo

    if(isDynamoDatabase) {
      clienteRepo = new ClienteDynamoRepository();
      itemRepo = new ItemDynamoRepository();
    } else {
      clienteRepo = !isMongoDatabase ? new ClienteMemoriaRepository() : new ClienteMongoRepository();
      itemRepo = !isMongoDatabase ? new ItemMemoriaRepository() : new ItemMongoRepository();
    }
    
    this.clienteController = new ClienteController(clienteRepo)
    this.itemController = new ItemController(itemRepo)
  }

  public static get Instance() {
    return this.instance || (this.instance = new this())
  }
}
