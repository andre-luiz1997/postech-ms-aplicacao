import { v4 as uuid } from "uuid"
export abstract class DefaultClass {
  [key: string]: any;

  generateId() {
    if (!this._id) {
      this._id = uuid()
    }
  }
}