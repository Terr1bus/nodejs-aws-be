import { Client } from 'pg';

export class BaseModel {
  protected client: Client;

  constructor(client: Client) {
    this.client = client;
  }
}
