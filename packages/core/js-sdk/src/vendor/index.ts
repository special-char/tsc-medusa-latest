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
    return this.client.fetch<any>(`/vendors/vendor-create`, {
      headers,
      method: "POST",
      body: data,
    })
  }

  async retrieve(headers?: ClientHeaders) {
    return this.client.fetch<any>(`/vendors`, {
      headers,
    })
  }

  async retrieveById(id: string, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/vendors/${id}`, {
      headers,
    })
  }
}
