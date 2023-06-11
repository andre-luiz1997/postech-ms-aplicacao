import { Repository } from "@shared/ports/repository";
import { UseCase } from "@shared/ports/usecase";
import { DtoValidationException } from "@shared/exceptions/dtoValidationError.exception";
import { Cliente } from "@domain/cliente/entities/cliente";

interface CadastrarClienteDto {
    nome?: string;
    email?: string;
    cpf?: string;
}

type OutputProps = Cliente

export class CadastrarClienteUseCase implements UseCase<CadastrarClienteDto, OutputProps> {

    constructor(private readonly repository: Repository<Cliente>){}

    async execute(props: CadastrarClienteDto): Promise<OutputProps> {
        if(!props.cpf && !props.email && !props.nome) throw new DtoValidationException(['Ao menos um dos campos é obrigatório']);
        
        const item = new Cliente(props);

        return await this.repository.criar({item});
    }

}