import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

type UpdateProductType = {
  images?: string[] | undefined
  thumbnail?: string | undefined | null
}

export class ProductVariantImages {
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

  async updateProductVariant(
    variantId: string,
    body: UpdateProductType,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    console.log({ updateProductVariantBody: body })

    return await this.client.fetch<{
      product_variant: HttpTypes.AdminProductVariant
    }>(`/admin/product-variant-images/product-variant/${variantId}`, {
      method: "POST",
      headers,
      body,
      query,
    })
  }

  async retrieveByProductVariant(
    id: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{ product: HttpTypes.AdminProduct }>(
      `/admin/product-variant-images/product-variant/${id}`,
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
  //     `/admin/product-variant-images`,
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
