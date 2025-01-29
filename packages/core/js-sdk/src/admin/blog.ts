import { Client } from "../client"

type BlogType = {
  title: string
  subtitle?: string
  handle: string
  image?: string
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
  image?: string
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
    return await this.client.fetch(`/admin/blogs/${id}`, {
      method: "PUT",
      body,
    })
  }

  async create(body: BlogType) {
    return await this.client.fetch(`/admin/blogs`, {
      method: "POST",
      body,
    })
  }

  async retrieve(id: string) {
    return await this.client.fetch<BlogProps>(`/admin/blogs/${id}`, {
      method: "GET",
    })
  }
}
