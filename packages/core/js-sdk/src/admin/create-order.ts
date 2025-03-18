import { AdminOrder } from "@medusajs/types"
import { Client } from "../client"

export class CreateOrder {
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

  async create(body): Promise<AdminOrder> {
    console.log("createBody:::::::::::", body)

    return await this.client.fetch(`/admin/create-order`, {
      method: "POST",
      body,
    })
  }
}
