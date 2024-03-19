import { Repository } from "@shared/ports/repository"
import { Cliente } from "@domain/cliente/entities/cliente"
import { CadastrarClienteUseCase } from "@domain/cliente/usecases/cadastrarCliente.usecase"
import { isCPFValido, sanitizar } from "src/shared/utils"
import { CPFInvalidoException } from "src/shared/exceptions/cpfInvalido.exception"
import { EditarClienteUseCase } from "../usecases/editarCliente.usecase"
import { CadastrarClienteDto } from "../dtos/cadastrarCliente.dto"
import { EditarClienteDto } from "../dtos/editarCliente.dto"
import { IMessagingQueue } from "src/infra/messaging/ports/queue"
import { DeletarClienteUseCase } from "../usecases/deletarCliente.usecase"
import { DeletarLGPDUseCase } from "../usecases/deletarLGPD.usecase"

export class ClienteController {
  private readonly cadastrarUseCase: CadastrarClienteUseCase
  private readonly editarUseCase: EditarClienteUseCase
  private readonly deletarUseCase: DeletarClienteUseCase
  private readonly deletarLGPDUseCase: DeletarLGPDUseCase

  constructor(
    private readonly repository: Repository<Cliente>,
    private readonly messagingQueue: IMessagingQueue
  ) {
    this.messagingQueue = messagingQueue;
    this.cadastrarUseCase = new CadastrarClienteUseCase(this.repository)
    this.editarUseCase = new EditarClienteUseCase(this.repository,this.messagingQueue)
    this.deletarUseCase = new DeletarClienteUseCase(this.repository,this.messagingQueue)
    this.deletarLGPDUseCase = new DeletarLGPDUseCase(this.repository,this.messagingQueue)
  }

  async listar() {
    return this.repository.listar()
  }

  async buscarUm(_id: string) {
    return this.repository.buscarUm({
      query: {
        _id,
      },
    })
  }

  async buscarCPF(cpf: string) {
    if (!isCPFValido(cpf)) throw new CPFInvalidoException()
    return this.repository.buscarUm({
      query: {
        cpf: sanitizar(cpf),
      },
    })
  }

  async criar(body: CadastrarClienteDto) {
    const transaction = await this.repository.startTransaction()
    try {
      let createdItem; 
      await this.repository.inTransaction(transaction, async () => {
        createdItem = await this.cadastrarUseCase.execute({data: body, transaction})
      })
      await this.repository.commitTransaction(transaction)
      return createdItem
    } catch (error) {
      await this.repository.rollbackTransaction(transaction)
      throw error
    }
  }

  async editar(body: EditarClienteDto) {
    const transaction = await this.repository.startTransaction()
    try {
      let res; 
      await this.repository.inTransaction(transaction, async () => {
        res = await this.editarUseCase.execute({data: body, transaction});
      })
      await this.repository.commitTransaction(transaction)
      return res
    } catch (error) {
      await this.repository.rollbackTransaction(transaction)
      throw error
    }
  }

  async deletar(_id: string) {
    const transaction = await this.repository.startTransaction()
    try {
      let res; 
      await this.repository.inTransaction(transaction, async () => {
        res = await this.deletarUseCase.execute({_id, transaction});
      })
      await this.repository.commitTransaction(transaction)
      return res
    } catch (error) {
      await this.repository.rollbackTransaction(transaction)
      throw error
    }
  }

  async deletarLGPD(_id: string) {
    const transaction = await this.repository.startTransaction()
    try {
      let res; 
      await this.repository.inTransaction(transaction, async () => {
        res = await this.deletarLGPDUseCase.execute({_id, transaction});
      })
      await this.repository.commitTransaction(transaction)
      return res
    } catch (error) {
      await this.repository.rollbackTransaction(transaction)
      throw error
    }
  }
}
