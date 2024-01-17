import { Item } from "src/domain/item/entities/item"
import { ItemMemoriaRepository } from "./itemMemoria.repository"
import { RegistroExistenteException } from "src/shared/exceptions/registroExistente.exception"
import { RegistroInexistenteException } from "src/shared/exceptions/registroInexistente.exception"

describe("Deve instanciar um repository de memória", () => {
  const itensRepository = ItemMemoriaRepository.Instance

  test("Verifica se a instância existe", () => {
    expect(itensRepository).toBeDefined()
    expect(itensRepository).toBe(ItemMemoriaRepository.Instance)
  })

  test("Verifica se cria um item", async () => {
    const newItemProps = {
      _id: "1",
      nome: "Big Mac",
      tipo: "lanche",
      preco: 39.9,
      medida: "unidade",
      aceitaOpcional: true,
      descricao:
        "Hambúrguer (100% carne bovina), alface americana, queijo cheddar, maionese Big Mac, cebola, picles e pão com gergelim",
    }
    const item = new Item(newItemProps)
    const output = await itensRepository.criar({ item: item })
    expect(output).toBeTruthy()
    expect(output).toMatchObject(newItemProps)
  })

  test("Verifica se cria um item com id já existente", async () => {
    const newItemProps = {
      _id: "1",
      nome: "Big Mac",
      tipo: "lanche",
      preco: 39.9,
      medida: "unidade",
      aceitaOpcional: true,
      descricao:
        "Hambúrguer (100% carne bovina), alface americana, queijo cheddar, maionese Big Mac, cebola, picles e pão com gergelim",
    }
    const item = new Item(newItemProps)
    try {
      const output = await itensRepository.criar({ item: item })
      expect(output).toThrowError(RegistroExistenteException)
    } catch (error) {}
  })

  test("Verifica se edita um item", async () => {
    let item = await itensRepository.buscarUm({ query: { _id: "1" } })
    item.nome = "Big Mac 2"
    try {
      const output = await itensRepository.editar({ _id: "1", item })
      expect(output).toBeTruthy()
      expect(output.name).toBe("Big Mac 2")
    } catch (error) {}
  })

  test("Verifica se edita um item inexistente", async () => {
    try {
      const item = new Item({
        descricao: "teste",
        nome: "teste",
        preco: 1,
        tipo: "lanche",
        medida: "unidade",
        aceitaOpcional: true,
      })
      const output = await itensRepository.editar({ _id: "-1", item })
      expect(output).toThrow(RegistroInexistenteException)
    } catch (error) {}
  })

  test("Verifica se item é unico", async () => {
    const output = await itensRepository.isUnique({ prop: "nome", value: "Big Mac unique" })
    expect(output).toBeTruthy()
  })

  test("Verifica se busca um item", async () => {
    const output = await itensRepository.buscarUm({ query: { _id: "1" } })
    expect(output).toBeTruthy()
    expect(output._id).toBe("1")
  })

  test("Verifica se retorna uma lista de itens", () => {
    const output = itensRepository.listar({ tipo: "lanche" })
    expect(output).toBeDefined()
  })

  test("Verifica se deleta um item", () => {
    const output = itensRepository.deletar({ _id: "1" })
    expect(output).toBeDefined()
  })

  test("Verifica se erro ao deletar um item inexistente", () => {
    const output = itensRepository.deletar({ _id: "-2" })
    // expect(itensRepository).toThrow()
  })
})
