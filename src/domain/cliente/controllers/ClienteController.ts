import { Repository } from "@shared/ports/repository"
import { Cliente } from "@domain/cliente/entities/cliente"
import { CadastrarClienteUseCase } from "@domain/cliente/usecases/cadastrarCliente.usecase"
import { isCPFValido, sanitizar } from "src/shared/utils"
import { CPFInvalidoException } from "src/shared/exceptions/cpfInvalido.exception"
import { EditarClienteUseCase } from "../usecases/editarCliente.usecase"
import { CadastrarClienteDto } from "../dtos/cadastrarCliente.dto"
import { EditarClienteDto } from "../dtos/editarCliente.dto"
import { PedidoMS } from "src/infra/ms/pedido"
import config from "src/shared/config"
import { IMessagingQueue } from "src/infra/messaging/ports/queue"

export class ClienteController {
  private readonly cadastrarUseCase: CadastrarClienteUseCase
  private readonly editarUseCase: EditarClienteUseCase

  constructor(
    private readonly repository: Repository<Cliente>,
    private readonly messagingQueue: IMessagingQueue
  ) {
    this.messagingQueue = messagingQueue;
    this.cadastrarUseCase = new CadastrarClienteUseCase(this.repository, this.messagingQueue)
    this.editarUseCase = new EditarClienteUseCase(this.repository)
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
    return this.cadastrarUseCase.execute(body)
  }

  async editar(body: EditarClienteDto) {
    const res = await this.editarUseCase.execute(body);
    return res;
  }

  async deletar(_id: string) {
    return this.repository.deletar({ _id })
  }
}
