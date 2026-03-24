import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Meilisearch {
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
   * This method syncs a product to the productList Meilisearch index.
   * 
   * @param productId - The ID of the product to sync.
   * @param headers - Headers to pass in the request.
   * @returns The sync operation details.
   * 
   * @example
   * sdk.admin.meilisearch.productListSyncProduct("prod_123")
   * .then((res) => {
   *   console.log(res)
   * })
   */
  async productListSyncProduct(
    productId: string,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<any>(
      `/admin/meilisearch/productlist-sync-product`,
      {
        method: "POST",
        headers,
        body: {
          product_id: productId
        },
      }
    )
  }
}
