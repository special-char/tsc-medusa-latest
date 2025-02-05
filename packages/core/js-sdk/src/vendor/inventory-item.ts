import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class InventoryItem {
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

  async list(
    query?: HttpTypes.AdminInventoryItemParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminInventoryItemListResponse>(
      `/vendors/inventory-items`,
      {
        query,
        headers,
      }
    )
  }

}
