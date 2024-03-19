import { Repository } from "@shared/ports/repository"
import { Item, ItemProps } from "@domain/item/entities/item"
import { EditarItemUseCase } from "../usecases/editarItem.usecase";
import { CadastrarItemUseCase } from "../usecases/cadastrarItem.usecase";

export class ItemController {
  private readonly cadastrarItemUseCase: CadastrarItemUseCase;
  private readonly editarItemUseCase: EditarItemUseCase;
  constructor(private readonly repository: Repository<Item>) {
    this.cadastrarItemUseCase = new CadastrarItemUseCase(this.repository)
    this.editarItemUseCase = new EditarItemUseCase(this.repository)
  }

  async listar(queryProps?: Object) {
    return this.repository.listar(queryProps)
  }

  async buscarUm(_id: string) {
    return this.repository.buscarUm({
      query: {
        _id,
      },
    })
  }

  async criar(body: ItemProps) {
    const transaction = await this.repository.startTransaction()
    try {
      let createdItem; 
      await this.repository.inTransaction(transaction, async () => {
        createdItem = await this.cadastrarItemUseCase.execute({data: body, transaction})
      })
      await this.repository.commitTransaction(transaction)
      return createdItem
    } catch (error) {
      await this.repository.rollbackTransaction(transaction)
      throw error
    }
  }

  async editar(_id: string, body: ItemProps) {
    const transaction = await this.repository.startTransaction()
    try {
      let res; 
      await this.repository.inTransaction(transaction, async () => {
        res = await this.editarItemUseCase.execute({_id, props: body, transaction});
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
        res = await this.repository.deletar({_id, transaction});
      })
      await this.repository.commitTransaction(transaction)
      return res
    } catch (error) {
      await this.repository.rollbackTransaction(transaction)
      throw error
    }
  }
}
