import { Client, ClientConfig } from 'pg';

const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
const defaultConfig: ClientConfig = {
  user: DB_USERNAME,
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  database: DB_NAME,
  password: DB_PASSWORD,
};

export class Database {
  private connection: Client;
  private isConnected = false;

  constructor(config?: ClientConfig) {
    this.connection = new Client({ ...defaultConfig, ...config });
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.connection.connect();
    }
  }

  public async getConnection(): Promise<Client> {
    await this.connect();
    return this.connection;
  }
}
