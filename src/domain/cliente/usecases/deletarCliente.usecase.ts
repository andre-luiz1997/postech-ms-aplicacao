import { Repository } from "@shared/ports/repository";
import { UseCase } from "@shared/ports/usecase";
import { DtoValidationException } from "@shared/exceptions/dtoValidationError.exception";
import { Cliente } from "@domain/cliente/entities/cliente";
import { EditarClienteDto } from "@domain/cliente/dtos/editarCliente.dto";
import { CPFInvalidoException } from "@shared/exceptions/cpfInvalido.exception";
import { isCPFValido, sanitizar } from "@shared/utils";
import config from "src/shared/config";
import { IMessagingQueue } from "src/infra/messaging/ports/queue";


type OutputProps = Boolean

export class DeletarClienteUseCase implements UseCase<string, OutputProps> {
    private queue: string;
    constructor(
        private readonly repository: Repository<Cliente>,
        private readonly messagingQueue: IMessagingQueue
    ){
        this.queue = config.queue.queues.queue2;
    }

    async execute(_id: string): Promise<OutputProps> {
        const item = await this.repository.buscarUm({query: {_id}});
        const res = await this.repository.deletar({_id})
        this.messagingQueue.publishToQueue(this.queue, item.toString())
        return res;
    }

}