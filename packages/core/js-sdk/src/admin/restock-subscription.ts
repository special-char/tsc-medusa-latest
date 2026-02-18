import { Client } from "../client"
import { ClientHeaders } from "../types"

export class RestockSubscription {
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

  /**
   * This method retrieves a paginated list of restock subscriptions.
   *
   * @param query - Configure the fields to retrieve and filtering.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of restock subscriptions.
   */
  async list(query?: Record<string, any>, headers?: ClientHeaders) {
    return await this.client.fetch<any>(`/admin/restock-subscriptions`, {
      headers,
      query,
    })
  }

  /**
   * This method resends a restock notification for a subscription.
   *
   * @param id - The ID of the restock subscription.
   * @param headers - Headers to pass in the request.
   * @returns JSON response.
   */
  async resend(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<any>(
      `/admin/restock-subscriptions/${id}/resend`,
      {
        method: "POST",
        headers,
      }
    )
  }
}
