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

}
