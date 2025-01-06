import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Vendor {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  async create(data: any, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/vendors`, {
      headers,
      method: "POST",
      body: data,
    })
  }
}
