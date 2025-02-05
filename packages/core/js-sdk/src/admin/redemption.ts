import { HttpTypes } from "@medusajs/types"
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
  async retrieveHistories(
    queryParams?: HttpTypes.AdminOrderFilters,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<any>(`/admin/redemption/history`, {
      method: "GET",
      headers,
      query: queryParams,
    })
  }
  async retrieve(redemptionId: string, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/redemption/${redemptionId}`, {
      method: "GET",
      headers,
    })
  }
}
