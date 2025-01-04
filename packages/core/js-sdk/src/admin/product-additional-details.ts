import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

type ProductAdditionalDetailsType = {
  additional_description: string
  additional_details_content: string
  additional_details_title: string
  grid_view: boolean
}

export class ProductAdditionalDetails {
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

  async updateProductAdditionalDetails(
    productId: string,
    body: ProductAdditionalDetailsType,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{
      product: HttpTypes.AdminProduct
    }>(`/admin/product-additional-details/product/${productId}`, {
      method: "POST",
      headers,
      body,
      query,
    })
  }

  async retrieveByProduct(
    productId: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{ product: HttpTypes.AdminProduct }>(
      `/admin/product-additional-details/product/${productId}`,
      {
        query,
        headers,
      }
    )
  }

  // async create(
  //   body: HttpTypes.AdminCreateRegion,
  //   query?: SelectParams,
  //   headers?: ClientHeaders
  // ) {
  //   return await this.client.fetch<{ region: HttpTypes.AdminRegion }>(
  //     `/admin/regions`,
  //     {
  //       method: "POST",
  //       headers,
  //       body,
  //       query,
  //     }
  //   )
  // }

  // async update(
  //   id: string,
  //   body: HttpTypes.AdminUpdateRegion,
  //   query?: SelectParams,
  //   headers?: ClientHeaders
  // ) {
  //   return await this.client.fetch<{ region: HttpTypes.AdminRegion }>(
  //     `/admin/regions/${id}`,
  //     {
  //       method: "POST",
  //       headers,
  //       body,
  //       query,
  //     }
  //   )
  // }

  // async list(
  //   queryParams?: FindParams & HttpTypes.AdminRegionFilters,
  //   headers?: ClientHeaders
  // ) {
  //   return await this.client.fetch<
  //     PaginatedResponse<{ regions: HttpTypes.AdminRegion[] }>
  //   >(`/admin/regions`, {
  //     query: queryParams,
  //     headers,
  //   })
  // }

  // async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
  //   return await this.client.fetch<{ region: HttpTypes.AdminRegion }>(
  //     `/admin/regions/${id}`,
  //     {
  //       query,
  //       headers,
  //     }
  //   )
  // }

  // async delete(id: string, headers?: ClientHeaders) {
  //   return await this.client.fetch<HttpTypes.AdminRegionDeleteResponse>(
  //     `/admin/regions/${id}`,
  //     {
  //       method: "DELETE",
  //       headers,
  //     }
  //   )
  // }
}
