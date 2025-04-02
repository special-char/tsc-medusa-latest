import { Client } from "../client"

type BannerType = {
  name: string
  link?: string
  image: File | string
  description?: string
  isActive?: boolean | undefined
}

type BannerProps = {
  id: string
  name: string
  link?: string
  image: string
  description?: string
  isActive?: boolean | undefined
}

type UPDATE_BANNER_TYPE = {
  name: string
  link?: string
  image: File | string
  description?: string
  isActive?: boolean | undefined
}

export class Banner {
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

  async list() {
    return await this.client.fetch<{ bannerList: BannerProps[] }>(
      `/admin/banner`,
      {
        method: "GET",
      }
    )
  }

  async delete(id: string) {
    return await this.client.fetch(`/admin/banner/${id}`, {
      method: "DELETE",
    })
  }

  async update(id: string, body: UPDATE_BANNER_TYPE) {
    console.log("updateBody:::::::::::", body)

    const formData = new FormData()

    formData.append("name", body.name || "")
    formData.append("link", body.link || "")
    formData.append("description", body.description || "")
    formData.append("isActive", String(body.isActive) || "false")

    if (typeof body.image === "string" || !body.image) {
      console.log("image_url", body.image)
      formData.append("image", body.image || "")
    }

    if (body.image?.[0] && body.image?.[0] instanceof File) {
      formData.append("files", body.image?.[0], body.image?.[0]?.name)
    }

    console.log("formData", formData)

    return await this.client.fetch(`/admin/banner/${id}`, {
      method: "PUT",
      headers: {
        "content-type": null,
      },
      body: formData,
    })
  }

  async create(body: BannerType) {
    console.log("createBody:::::::::::", body)

    const formData = new FormData()

    formData.append("name", body.name || "")
    formData.append("link", body.link || "")
    formData.append("description", body.description || "")
    formData.append("isActive", body.isActive ? "true" : "false")

    if (typeof body.image === "string" || !body.image) {
      console.log("image_url", body.image)
      formData.append("image", body.image || "")
    }

    if (body.image?.[0] && body.image?.[0] instanceof File) {
      formData.append("files", body.image[0], body.image[0].name)
    }

    console.log("formData", formData)

    return await this.client.fetch(`/admin/banner`, {
      method: "POST",
      headers: {
        "content-type": null,
      },
      body: formData,
    })
  }

  async retrieve(id: string) {
    return await this.client.fetch<BannerProps>(`/admin/banner/${id}`, {
      method: "GET",
    })
  }
}
