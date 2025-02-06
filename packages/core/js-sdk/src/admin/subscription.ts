import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Subscription {
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

  async retrieveByQuery(query?: URLSearchParams, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/subscriptions?${query?.toString()}`, {
      method: "GET",
      headers,
    })
  }
  async retrieveById(id: string, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/subscriptions/${id}`, {
      method: "GET",
      headers,
    })
  }
}
