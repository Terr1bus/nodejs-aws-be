export class Database {
  private isConnected = false;
  private connection = {
    query: () => null,
    end: () => null,
  };

  constructor() {
    this.connect();
  }

  public async connect() {
    this.isConnected = true;
  }

  public async getConnection() {
    return this.connection;
  }
}
