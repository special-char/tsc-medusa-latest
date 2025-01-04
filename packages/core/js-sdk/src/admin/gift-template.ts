import { Client } from "../client"

export class GiftTemplate {
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

  async list() {
    return await this.client.fetch(`/admin/gift-templates`, {
      method: "GET",
    })
  }

  async create(body: any) {
    return await this.client.fetch(`/admin/gift-templates`, {
      method: "POST",
      body,
    })
  }
  async update(id: string, body: any) {
    return await this.client.fetch(`/admin/gift-templates/${id}`, {
      method: "PUT",
      body,
    })
  }
  async delete(id: string) {
    return await this.client.fetch(`/admin/gift-templates/${id}`, {
      method: "DELETE",
    })
  }
}
