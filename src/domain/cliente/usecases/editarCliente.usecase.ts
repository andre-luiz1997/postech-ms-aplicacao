import { Repository } from "@shared/ports/repository";
import { UseCase } from "@shared/ports/usecase";
import { DtoValidationException } from "@shared/exceptions/dtoValidationError.exception";
import { Cliente } from "@domain/cliente/entities/cliente";
import { EditarClienteDto } from "@domain/cliente/dtos/editarCliente.dto";
import { CPFInvalidoException } from "@shared/exceptions/cpfInvalido.exception";
import { isCPFValido, sanitizar } from "@shared/utils";
import config from "src/shared/config";
import { IMessagingQueue } from "src/infra/messaging/ports/queue";

type InputProps = {data: EditarClienteDto, transaction?: any }
type OutputProps = Cliente

export class EditarClienteUseCase implements UseCase<InputProps, OutputProps> {
    private queue: string;
    constructor(
        private readonly repository: Repository<Cliente>,
        private readonly messagingQueue: IMessagingQueue
    ){
        this.queue = config.queue.queues.queue1;
    }

    async execute({data: {_id, props}, transaction}: InputProps): Promise<OutputProps> {
        if(!props.cpf && !props.email && !props.nome) throw new DtoValidationException(['Ao menos um dos campos é obrigatório']);
        if(props.cpf && !isCPFValido(props.cpf)) throw new CPFInvalidoException()
        if(props.cpf) props.cpf = sanitizar(props.cpf);

        let item = new Cliente(props);
        item = await this.repository.editar({_id, item, transaction})
        this.messagingQueue.publishToQueue(this.queue, JSON.stringify(item))
        return item;
    }

}