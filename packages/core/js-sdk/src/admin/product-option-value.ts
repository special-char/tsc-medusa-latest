import { Client } from "../client"
import { ClientHeaders } from "../types"

type optionBody = {
  metadata: {
    color1: string | null
    color2: string | null
    thumbnail: string | null
  }
}

export class ProductOptionValue {
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

  async createOptionValue(
    id: string,
    body: optionBody,
    headers?: ClientHeaders
  ) {
    return this.client.fetch<any>(`/admin/update-option-values/${id}`, {
      method: "PUT",
      headers,
      body,
    })
  }
}
