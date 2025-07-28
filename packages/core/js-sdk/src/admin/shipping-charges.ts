import { Client } from "../client"
import { ClientHeaders } from "../types"

export interface ShippingChargeData {
  [key: string]: string
}

export class ShippingCharges {
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

  async create(
    body: ShippingChargeData[],
    headers?: ClientHeaders
  ) {
    return await this.client.fetch(
      `/admin/shipping-charges`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  async get(
    headers?: ClientHeaders
  ) {
    return await this.client.fetch(
      `/admin/shipping-charges`,
      { method: "GET", headers }
    )
  }

  async delete(
    headers?: ClientHeaders
  ) {
    return await this.client.fetch(
      `/admin/shipping-charges`,
      { method: "DELETE", headers }
    )
  }
}