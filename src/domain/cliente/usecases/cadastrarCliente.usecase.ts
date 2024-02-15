import { Repository } from "@shared/ports/repository"
import { UseCase } from "@shared/ports/usecase"
import { DtoValidationException } from "@shared/exceptions/dtoValidationError.exception"
import { Cliente } from "@domain/cliente/entities/cliente"
import { CadastrarClienteDto } from "@domain/cliente/dtos/cadastrarCliente.dto"
import { CPFInvalidoException } from "@shared/exceptions/cpfInvalido.exception"
import { isCPFValido, sanitizar } from "@shared/utils"

type OutputProps = Cliente
type InputProps = {data: CadastrarClienteDto, transaction?: any }

export class CadastrarClienteUseCase implements UseCase<InputProps, OutputProps> {
  constructor(private readonly repository: Repository<Cliente>) {}

  async execute({data: props, transaction}: InputProps): Promise<OutputProps> {
    if (!props.cpf && !props.email && !props.nome)
      throw new DtoValidationException(["Ao menos um dos campos é obrigatório"])
    if (props.cpf && !isCPFValido(props.cpf)) throw new CPFInvalidoException()
    if (props.cpf) props.cpf = sanitizar(props.cpf)

    const item = new Cliente(props)
    const cliente = await this.repository.criar({ item, transaction })
    return cliente
  }
}
