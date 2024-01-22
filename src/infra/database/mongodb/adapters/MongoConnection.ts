import mongoose, { MongooseOptions, mongo } from "mongoose";
import Connection, { ConnectionProps } from "src/shared/ports/connection";
import { emptyToUndefined } from "src/shared/utils";

export class MongoConnection implements Connection {
  connection: typeof mongoose;
  props: ConnectionProps;
  private connectionString: string;

  constructor(props: ConnectionProps) {
    this.props = props;
    this.configure();
  }

  private configure() {
    this.createConnectionString();
  }

  private createConnectionString() {
    let userString = `${this.props.user ?? ""}${
      this.props.password ? ":" + this.props.password : ""
    }@`;
    this.connectionString = `mongodb://`;
    if (emptyToUndefined(this.props.user)) {
      this.connectionString += userString;
    }
    this.connectionString += `${this.props.host}:${this.props.port}/${this.props.database}`;
  }
  
  async connect(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      console.log("🚀 ~ MongoConnection ~ createConnectionString ~ this.connectionString:", this.connectionString)
      mongoose
        .connect(this.connectionString)
        .then((res) => {
          this.connection = res;
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
