import mongoose, { MongooseOptions, mongo } from "mongoose";
import Connection, { ConnectionProps } from "src/shared/ports/connection";
import { emptyToUndefined } from "src/shared/utils";

export class MongoConnection implements Connection {
  connection: typeof mongoose;
  static props: ConnectionProps;
  private connectionString: string;
  private static instance: MongoConnection;

  private constructor() {
    this.configure();
  }

  static get Instance() {
    return this.instance || (this.instance = new this());
  }

  private configure() {
    this.createConnectionString();
  }

  private createConnectionString() {
    let userString = `${MongoConnection.props.user ?? ""}${
      MongoConnection.props.password ? ":" + MongoConnection.props.password : ""
    }@`;
    this.connectionString = `mongodb://`;
    if (emptyToUndefined(MongoConnection.props.user)) {
      this.connectionString += userString;
    }
    this.connectionString += `${MongoConnection.props.host}:${MongoConnection.props.port}/${MongoConnection.props.database}`;
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
