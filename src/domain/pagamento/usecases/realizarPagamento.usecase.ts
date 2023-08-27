import { BaseRepository, Repository } from "@shared/ports/repository";
import { UseCase } from "@shared/ports/usecase";
import { Item, ItemProps } from "@domain/item/entities/item";
import { Pagamento, PagamentoProps } from "../entities/pagamento";
import { RealizarPagamentoDto } from "../dtos/realizarPagamento.dto";
import { Pedido } from "src/domain/pedido/entities/pedido";
import GatewayPagamento from "../ports/gatewayPagamento";

type InputProps = RealizarPagamentoDto;
type OutputProps = Pagamento;

export class RealizarPagamentoUseCase
  implements UseCase<InputProps, OutputProps>
{
  constructor(
    private readonly repository: BaseRepository<Pagamento>,
    private readonly pedidoRepository: BaseRepository<Pedido>,
    private readonly gateway: GatewayPagamento
  ) {}

  async execute(props: InputProps): Promise<OutputProps> {
    if(!props.pedido._id) throw new Error("Pedido não informado");
    const pedido = await this.pedidoRepository.buscarUm({query: {_id: props.pedido._id}});
    if(!pedido) throw new Error("Pedido não encontrado");
    props.pedido = pedido;

    const _pagamento = await this.repository.buscarUm({query: {pedido: props.pedido._id}});
    console.log(_pagamento);
    if(_pagamento?.status === "pago") throw new Error("Pedido já pago");

    let pagamento = new Pagamento(props);
    pagamento.validar();
    pagamento = await this.repository.criar({item: pagamento})
    const res = await this.gateway.processar(pagamento);
    if(res.code === 200) return this.repository.buscarUm({query: {_id: pagamento._id}});
  }
}
