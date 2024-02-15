import { Repository } from "@shared/ports/repository";
import { UseCase } from "@shared/ports/usecase";
import { Item, ItemProps } from "@domain/item/entities/item";

interface CadastrarItemDto  {
  data?: ItemProps;
  transaction?: any;
}

type OutputProps = Item;

export class CadastrarItemUseCase
  implements UseCase<CadastrarItemDto, OutputProps>
{
  constructor(private readonly repository: Repository<Item>) {}

  async execute(props: CadastrarItemDto): Promise<OutputProps> {
    const item = new Item(props.data);

    return await this.repository.criar({item, transaction: props.transaction});
  }
}
