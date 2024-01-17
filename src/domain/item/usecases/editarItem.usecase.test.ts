import { ItemMemoriaRepository } from "src/infra/database/memory/item/repositories/itemMemoria.repository"
import { RegistroInexistenteException } from "src/shared/exceptions/registroInexistente.exception"
import { ItemProps } from "../entities/item"
import { EditarItemUseCase } from "./editarItem.usecase"

const itensRepository = ItemMemoriaRepository.Instance
const editarItemUseCase = new EditarItemUseCase(itensRepository)

describe("Deve editar um item", () => {
  test("Deve editar um item", async function () {
    const itens = await itensRepository.listar()
    if (itens[0]) {
      const newItemProps: ItemProps = {
        _id: itens[0]._id,
        nome: "Big Mac",
        tipo: "lanche",
        preco: 39.9,
        medida: "unidade",
        aceitaOpcional: true,
        descricao:
          "Hambúrguer (100% carne bovina), alface americana, queijo cheddar, maionese Big Mac, cebola, picles e pão com gergelim",
      }
      const output = await editarItemUseCase.execute({ _id: itens[0]._id, props: newItemProps })
      expect(output).toMatchObject(newItemProps)
    }
  })
  
  test("Editar item sem que este exista na base", async function () {
    try {
      const output = await editarItemUseCase.execute({
        _id: "-1",
        props: {
          _id: "-1",
          nome: "Big Mac",
          tipo: "lanche",
          preco: 39.9,
          medida: "unidade",
          aceitaOpcional: true,
          descricao:
            "Hambúrguer (100% carne bovina), alface americana, queijo cheddar, maionese Big Mac, cebola, picles e pão com gergelim",
        },
      })
      expect(output).toThrowError(RegistroInexistenteException)
    } catch (error) {
      expect(error).toBeTruthy()
    }
  })
  
});
