import { BuscarUmProps, CriarProps, DeletarProps, EditarProps, IsUniqueProps, Repository } from "@shared/ports/repository"
import { RegistroExistenteException } from "@shared/exceptions/registroExistente.exception"
import { Cliente } from "@domain/cliente/entities/cliente"
import { RegistroInexistenteException } from "@shared/exceptions/registroInexistente.exception"
import { ClienteModel } from "@infra/database/mongodb/cliente/models/cliente.mongo"
import mongoose from "mongoose"
import { MongoConnection } from "../../adapters/MongoConnection"

export class ClienteMongoRepository implements Repository<Cliente> {

  async listar(): Promise<Cliente[]> {
    return ClienteModel.find({deletedAt: null})
  }

  async deletar({ _id,transaction }: DeletarProps): Promise<boolean> {
    const item = await this.buscarUm({ query: { _id }, transaction })
    if (!item) throw new RegistroInexistenteException({ campo: "id" })
    item.deletedAt = new Date()
    await ClienteModel.updateOne({ _id }, item,{session: transaction})
    return true
  }

  async criar({item, transaction}: CriarProps<Cliente>): Promise<Cliente> {
    // const isEmailUnique =
    //   item.email &&
    //   (await this.isUnique({
    //     prop: "email",
    //     value: item.email,
    //     transaction
    //   }))
    // if (isEmailUnique === false)
    //   throw new RegistroExistenteException({
    //     mensagem: `Já existe um registro com email ${item.email}`,
    //   })
    // const isCpfUnique =
    //   item.cpf &&
    //   (await this.isUnique({
    //     prop: "cpf",
    //     value: item.cpf,
    //     transaction
    //   }))
    // if (isCpfUnique === false)
    //   throw new RegistroExistenteException({
    //     mensagem: `Já existe um registro com cpf ${item.cpf}`,
    //   })
    // const isNomeUnique =
    //   item.nome &&
    //   (await this.isUnique({
    //     prop: "nome",
    //     value: item.nome,
    //     transaction
    //   }))
    // if (isNomeUnique === false)
    //   throw new RegistroExistenteException({
    //     mensagem: `Já existe um registro com nome ${item.nome}`,
    //   })

    // const query = item._id && {
    //   query: {
    //     _id: new mongoose.Types.ObjectId(item._id),
    //   },
    // }
    // const cliente = await this.buscarUm({ query, transaction })
    // if (item._id && cliente) throw new RegistroExistenteException({})
    item._id = new mongoose.Types.ObjectId()
    await ClienteModel.create([item],{session: transaction})
    return this.buscarUm({query: {query: {_id: item._id}},transaction})
  }

  async editar({ _id, item, transaction }: EditarProps<Cliente>): Promise<Cliente> {
    const query: BuscarUmProps = {
      query: {
        _id,
      },
    }
    if(transaction) query.transaction = transaction;
    const _cliente = await this.buscarUm({ query, transaction })
    if (!_cliente) throw new RegistroInexistenteException({ campo: "id" })
    await ClienteModel.updateOne({ _id }, item, {session: transaction})
    return this.buscarUm({query,transaction})
  }

  async buscarUm(props: BuscarUmProps): Promise<Cliente | null> {
    if(!props.query) props.query = {query: {}};
    if(!props.query.query) props.query.query = {};
    if (!props.query?.query?.deletedAt) {
      props.query.query.deletedAt = null;
    }
    return ClienteModel.findOne(props.query.query,{},{session: props.transaction}).lean();
  }

  async isUnique(props: IsUniqueProps): Promise<boolean> {
    let query: BuscarUmProps = {
      query: {
        [props.prop]: props.value,
      },
    }
    if(props.transaction) query.transaction = props.transaction;
    const item = await this.buscarUm(query)
    return item === null
  }

  async startTransaction() {
    return new Promise<any>((resolve) => resolve(null));
    // const session = await MongoConnection.Instance.connection.startSession();
    // session.startTransaction({
    //   session
    // })
    // return session;
  }

  async commitTransaction(transaction: mongoose.mongo.ClientSession) {
    if(!transaction) return;
    if(!transaction.inTransaction()) return;
    return transaction.commitTransaction();
  }

  async rollbackTransaction(transaction: mongoose.mongo.ClientSession) {
    if(!transaction) return;
    if(!transaction.inTransaction()) return;
    return transaction.abortTransaction() 
  }

  async inTransaction(transaction: mongoose.mongo.ClientSession, callback: () => Promise<any>) {
    if(!transaction) return callback();
    return MongoConnection.Instance.connection.transaction(callback);
  }
}
