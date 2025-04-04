import { CartDTO } from "@medusajs/types"

import { Client } from "../client"
import { ClientHeaders } from "../types"

export class PendingOrder {
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
   * This method retrieves a paginated list of pending orders as cart. It sends a request to the
   *
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of pending order carts.
   *
   * @example
   * To retrieve the list of pending orders:
   *
   * ```ts
   * sdk.admin.pendingOrders.list()
   * .then(({ carts, count, limit, offset }) => {
   *   console.log(orders)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.pendingOrders.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ orders, count, limit, offset }) => {
   *   console.log(orders)
   * })
   * ```
   */
  async list(
    queryParams?: { limit?: number; offset?: number },
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{
      carts: CartDTO[]
      count: number
      limit: number
      offset: number
    }>(`/admin/pending-orders`, {
      headers,
      query: {
        limit: queryParams?.limit,
        offset: queryParams?.offset,
      },
    })
  }

  /**
   * This method retrieves an order by its ID. It sends a request to the
   * API route.
   *
   * @param id - The order's ID.
   * @param query - Configure the fields to retrieve in the pending order.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   *
   * @example
   * To retrieve an order by its ID:
   *
   * ```ts
   * sdk.admin.pendingOrder.retrieve("order_123")
   * .then(({ order }) => {
   *   console.log(order)
   * })
   * ```
   *
   * */
  async retrieve(id: string) {
    return await this.client.fetch<{
      cart: CartDTO
    }>(`/admin/pending-orders/${id}`)
  }
}
