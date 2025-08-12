import { Client } from "../client"

export class CategoryFilterOption {
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

  async retrieve(handle: string) {
    return await this.client.fetch<any>(`/admin/category/filter/${handle}`, {
      method: "GET",
    })
  }
}
