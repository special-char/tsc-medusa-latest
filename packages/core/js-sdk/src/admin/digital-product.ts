import { Client } from "../client"
import { ClientHeaders } from "../types"

type CreateMedia = {
  type: "main" | "preview"
  file?: File
}

export class DigitalProduct {
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

  async retrieveAll(query: URLSearchParams, headers?: ClientHeaders) {
    return this.client.fetch<any>(
      `/admin/digital-products?${query.toString()}`,
      {
        method: "GET",
        headers,
      }
    )
  }

  async create(body: Record<string, any>, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/digital-products`, {
      method: "POST",
      headers,
      body,
    })
  }

  async upload(type: string, medias?: CreateMedia[], headers?: ClientHeaders) {
    const formData = new FormData()
    const mediaWithFiles = medias?.filter(
      (media) => media?.file !== undefined && media.type === type
    )

    if (!mediaWithFiles?.length) {
      return
    }

    mediaWithFiles.forEach((media) => {
      if (media?.file instanceof File) {
        console.log({ media })
        formData.append("files", media?.file!)
      }
    })

    return this.client.fetch<any>(`/admin/digital-products/upload/${type}`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": null,
      },
    })
  }
}
