import { DataReader } from "../../../shared/ports/dataReader";
import { Repository } from "../../../shared/ports/repository";
import { Seeder } from "../../../shared/ports/seeder";
import { Cliente, ClienteProps } from "../entities/cliente";
import { CadastrarClienteUseCase } from "../usecases/cadastrarCliente.usecase";

export class ClienteSeeder implements Seeder {
  private cadastrarClienteUseCase: CadastrarClienteUseCase;
  constructor(
    private readonly repository: Repository<Cliente>,
    private readonly dataReader: DataReader<ClienteProps[]>
  ) {
    this.cadastrarClienteUseCase = new CadastrarClienteUseCase(repository);
  }

  async seed(): Promise<number> {
    try {
      const data = await this.dataReader.read({
        path: "./domain/cliente/data/clientes.json",
      });
      await Promise.all(
        data.map(async (cliente) => {
          await this.cadastrarClienteUseCase.execute(cliente);
        })
      );

      console.log(
        `CLIENTES SEEDER SEEDED ${
          (await this.repository.listar()).length
        } records`
      );
      return data.length;
    } catch (error) {
        console.log("🚀 ~ file: cliente.seeder.ts:34 ~ ClienteSeeder ~ seed ~ error:", error)
    }
  }
}
