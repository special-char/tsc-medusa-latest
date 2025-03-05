import { Client } from "../client"
import { ClientHeaders } from "../types"

export class NotificationTemplate {
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

  async listTemplate(queryParams?: any, headers?: ClientHeaders) {
    return await this.client.fetch<any>(`/admin/notification-template`, {
      headers,
      query: queryParams,
    })
  }
  async retrieve(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<any>(`/admin/notification-template/${id}`, {
      headers,
    })
  }
  async update(id: string, data: any, headers?: ClientHeaders) {
    return await this.client.fetch<any>(`/admin/notification-template/${id}`, {
      method: "PUT",
      headers,
      body: data,
    })
  }
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<any>(`/admin/notification-template/${id}`, {
      method: "DELETE",
      headers,
    })
  }
  async create(data: any, headers?: ClientHeaders) {
    return await this.client.fetch<any>(`/admin/notification-template`, {
      method: "POST",
      headers,
      body: data,
    })
  }
  async listEvent(queryParams?: any, headers?: ClientHeaders) {
    return await this.client.fetch<any>(`/admin/notification-event`, {
      headers,
      query: queryParams,
    })
  }
}
