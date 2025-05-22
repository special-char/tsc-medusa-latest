import { AdminProduct } from "@medusajs/types"
import { Client } from "../client"

type SyncResponseType = {
  result: {
    products: AdminProduct[]
  }
}

export class PriceSync {
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

  async sync() {
    return await this.client.fetch<SyncResponseType>(`/admin/sync-product`, {
      method: "GET",
    })
  }
}
