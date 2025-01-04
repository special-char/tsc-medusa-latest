import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

type ProductCategoryDetailsType = {
  product_aspect_ratio?: string
  product_bg_color?: string
  media?: { url?: string; file: File }[]
  thumbnail?: { url?: string; file: File }
}

export class ProductCategoryDetails {
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

  async updateProductCategoryDetails(
    categoryId: string,
    body: ProductCategoryDetailsType,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    const formData = new FormData()

    const oldMedia =
      body?.media?.reduce((acc: string[], x: any) => {
        if (!x.file && x.url) {
          acc.push(x.url)
        }
        return acc
      }, []) ?? null

    const newMedia =
      body?.media?.reduce((acc: File[], x: any) => {
        if (x.file) {
          acc.push(x.file)
        }
        return acc
      }, []) ?? null

    if (body?.product_aspect_ratio && body?.product_aspect_ratio !== "") {
      formData.append("product_aspect_ratio", body?.product_aspect_ratio)
    }

    if (body?.product_bg_color && body?.product_bg_color !== "") {
      formData.append("product_bg_color", body?.product_bg_color)
    }

    if (body?.thumbnail?.file) {
      formData.append(
        "thumbnail",
        body?.thumbnail?.file,
        body?.thumbnail?.file.name
      )
    }

    if (body?.thumbnail?.url) {
      formData.append("old_thumbnail", body?.thumbnail?.url)
    }

    if (oldMedia && oldMedia?.length > 0) {
      oldMedia?.forEach((item: string) => {
        formData.append("old_media[]", item)
      })
    }

    if (newMedia && newMedia?.length > 0) {
      newMedia?.forEach((media: File) => {
        formData.append("media", media, media.name)
      })
    }

    return await this.client.fetch<{
      category: HttpTypes.AdminProductCategory
    }>(`/admin/product-category-details/category/${categoryId}`, {
      method: "POST",
      headers: {
        ...headers,
        // Let the browser determine the content type.
        "content-type": null,
      },
      body: formData,
      query,
    })
  }

  async retrieveByProductCategory(
    categoryId: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{
      category: HttpTypes.AdminProductCategory
    }>(`/admin/product-category-details/category/${categoryId}`, {
      query,
      headers,
    })
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
