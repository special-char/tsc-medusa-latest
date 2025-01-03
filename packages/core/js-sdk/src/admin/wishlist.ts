import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Wishlist {
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

  async retrieve(customerId: string, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/wishlist/customer/${customerId}`, {
      headers,
    })
  }
}
