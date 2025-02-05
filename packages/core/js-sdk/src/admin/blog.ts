import { Client } from "../client"

type BlogType = {
  title: string
  subtitle?: string
  handle: string
  image?: File | string
  content: string
  categories?: string[]
}

type BlogProps = {
  id: string
  title: string
  subtitle: string
  handle: string
  image: string | null
  content: string
  blogSeo: any | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  product_categories: {
    id: string
  }[]
}

type UPDATE_BLOG_TYPE = {
  title?: string
  subtitle?: string
  handle?: string
  image?: File | string
  content?: string
  categories?: string[]
}

export class Blog {
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
    return await this.client.fetch<{ blogs: BlogProps[] }>(`/admin/blogs`, {
      method: "GET",
    })
  }

  async delete(id: string) {
    return await this.client.fetch(`/admin/blogs/${id}`, {
      method: "DELETE",
    })
  }

  async update(id: string, body: UPDATE_BLOG_TYPE) {
    console.log("updateBody:::::::::::", body)

    const formData = new FormData()

    formData.append("title", body.title || "")
    formData.append("subtitle", body.subtitle || "")
    formData.append("handle", body.handle || "")
    formData.append("content", body.content || "")
    formData.append("categories", JSON.stringify(body.categories) || "")

    if (typeof body.image === "string" || !body.image) {
      console.log("image_url", body.image)
      formData.append("image", body.image || "")
    }

    if (body.image?.[0] && body.image?.[0] instanceof File) {
      formData.append("blogImage", body.image?.[0], body.image?.[0]?.name)
    }

    console.log("formData", formData)

    return await this.client.fetch(`/admin/blogs/${id}`, {
      method: "PUT",
      headers: {
        "content-type": null,
      },
      body: formData,
    })
  }

  async create(body: BlogType) {
    console.log("createBody:::::::::::", body)

    const formData = new FormData()

    formData.append("title", body.title || "")
    formData.append("subtitle", body.subtitle || "")
    formData.append("handle", body.handle || "")
    formData.append("content", body.content || "")
    formData.append("categories", JSON.stringify(body.categories) || "")

    if (typeof body.image === "string" || !body.image) {
      console.log("image_url", body.image)
      formData.append("image", body.image || "")
    }

    if (body.image?.[0] && body.image?.[0] instanceof File) {
      formData.append("blogImage", body.image?.[0], body.image?.[0]?.name)
    }

    console.log("formData", formData)

    return await this.client.fetch(`/admin/blogs`, {
      method: "POST",
      headers: {
        "content-type": null,
      },
      body: formData,
    })
  }

  async retrieve(id: string) {
    return await this.client.fetch<BlogProps>(`/admin/blogs/${id}`, {
      method: "GET",
    })
  }
}
