import { Cliente } from "src/domain/cliente/entities/cliente";
import { MicroserviceAdapter } from "./microservice.adapter";

export class PedidoMS extends MicroserviceAdapter {

    constructor(endpoint: string) {
        super(endpoint);
    }

    onUpdateCliente(cliente: Cliente) {
        return this.sendRequest({
            path: `/clientes/${cliente._id}`,
            method: 'PATCH',
            body: cliente,
        });
    }
}