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

  async retrieveAll(code?: string, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/redemption?code=${code}`, {
      method: "GET",
      headers,
    })
  }
  async addHistory(
    data: {
      redemption_id?: string
      vendor_id: string
      amount_spent: number
      where_deducted: string
    },
    headers?: ClientHeaders
  ) {
    return this.client.fetch<any>(`/admin/redemption/history`, {
      method: "POST",
      headers,
      body: data,
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
