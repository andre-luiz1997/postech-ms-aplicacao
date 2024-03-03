import {v4 as uuid} from 'uuid';
import { DefaultClass } from "@shared/types/defaultClass";

export interface ClienteProps {
  _id?: any;
  nome?: string;
  email?: string;
  cpf?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Cliente extends DefaultClass {
  _id?: any;
  nome?: string;
  email?: string;
  cpf?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(props: ClienteProps) {
    super();
    Object.assign(this, props);
  }
  
  generateId() {
    if(!this._id) {
      this._id = uuid();
    }
  }

  randomize() {
    this.nome = this.generateRandomName();
    this.email = this.generateRandomEmail();
    this.cpf = this.generateRandomCpf();
  }

  private generateRandomName(): string {
    return 'John Doe';
  }

  private generateRandomEmail(): string {
    // logic to generate a random email
    return `johndoe${Math.random()}@email.com`
  }

  private generateRandomCpf(): string {
    // logic to generate a random CPF
    return `${Math.random()}`;
  }
}
