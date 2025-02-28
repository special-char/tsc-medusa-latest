import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Brand {
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

  async create(data: any, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/brand`, {
      headers,
      method: "POST",
      body: data,
    })
  }
  async delete(id: string, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/brand/${id}`, {
      headers,
      method: "DELETE",
    })
  }

  async list(queryParams?: any, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/brand`, {
      headers,
      query: queryParams,
    })
  }
  async retrieve(id: string, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/brand/${id}`, {
      headers,
    })
  }

  async edit(id: string, data: any, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/brand/${id}`, {
      headers,
      method: "PUT",
      body: data,
    })
  }
}
