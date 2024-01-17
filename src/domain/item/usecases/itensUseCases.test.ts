import { JsonDataReader } from "@shared/adapters/jsonDataReader"
import { ItemProps } from "@domain/item/entities/item"
import { ItemMemoriaRepository } from "@infra/database/memory/item/repositories/itemMemoria.repository"
import { ItemSeeder } from "@infra/database/memory/item/seeders/item.seeder"
import { EditarItemUseCase } from "@domain/item/usecases/editarItem.usecase"
import { RegistroInexistenteException } from "src/shared/exceptions/registroInexistente.exception"

const itensDataReader = new JsonDataReader<ItemProps[]>()
const itensRepository = ItemMemoriaRepository.Instance
const itensSeeder = new ItemSeeder(itensRepository, itensDataReader)

describe("Testando itens", () => {
  test("Deve cadastrar um item", async function () {
    const expectedLength = await itensSeeder.seed()
    const output = await itensRepository.listar()
    expect(output).toHaveLength(expectedLength)
  })

  

  test("Deve deletar um item", async function () {
    const initialLength = (await itensRepository.listar())?.length
    const item = (await itensRepository.listar())[0]
    const output = await itensRepository.deletar({ _id: item._id })
    const endLength = (await itensRepository.listar())?.length
    expect(output).toBeTruthy()
    expect(endLength).toBe(initialLength - 1)
  })

  
})
