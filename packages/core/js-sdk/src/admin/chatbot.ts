import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Chatbot {
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

  async sync(headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/chatbot/sync`, {
      headers,
      method: "POST",
    })
  }
}
