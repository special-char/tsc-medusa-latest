import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Redemption {
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

  async retrieveAll(headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/redemption`, {
      method: "GET",
      headers,
    })
  }
  async retrieve(redemptionId: string, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/redemption/${redemptionId}`, {
      method: "GET",
      headers,
    })
  }
}
