import { Repository } from "@shared/ports/repository";
import { UseCase } from "@shared/ports/usecase";
import { Cliente } from "@domain/cliente/entities/cliente";
import config from "src/shared/config";
import { IMessagingQueue } from "src/infra/messaging/ports/queue";

type InputProps = {_id: string, transaction?: any}
type OutputProps = Cliente

export class DeletarLGPDUseCase implements UseCase<InputProps, OutputProps> {
    private queue: string;
    constructor(
        private readonly repository: Repository<Cliente>,
        private readonly messagingQueue: IMessagingQueue
    ){
        this.queue = config.queue.queues.queue3;
    }

    async execute({_id, transaction}: InputProps): Promise<OutputProps> {
        let item = await this.repository.buscarUm({query: {_id},transaction});
        item = new Cliente(item);
        item.randomize();
        const res = await this.repository.editar({_id,item,transaction})
        this.messagingQueue.publishToQueue(this.queue, JSON.stringify(item))
        return res;
    }

}