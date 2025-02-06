import { Client } from "../client"
type FaqCategoryProps = {
  id: string
  title: string
  handle: string
  created_at: Date
  updated_at: Date
  description: string
  metadata: Record<string, any>
  deleted_at: Date | null
}
type FaqProps = {
  id: string
  title: string
  content: string
  type: string
  by_admin: boolean
  display_status: "published" | "draft"
  email: string
  customer_name: string
  metadata: Record<string, any>
  category_id: string
  category: FaqCategoryProps
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
type FAQ_CATEGORY = {
  title: string
  description?: string
  metadata?: Record<string, any>
}

type FAQ_TYPE = {
  title: string
  content: string
  type: string
  by_admin: boolean
  display_status: "published" | "draft"
  email: string
  customer_name?: string
  metadata?: Record<string, any>
  category?: FAQ_CATEGORY
}
type FAQ_UPDATE_CATEGORY = {
  title?: string
  description?: string
  metadata?: Record<string, any>
}
type FAQ_UPDATE_TYPE = {
  title?: string
  content?: string
  type?: string
  by_admin?: boolean
  display_status?: "published" | "draft"
  email?: string
  customer_name?: string
  metadata?: Record<string, any>
  category?: FAQ_UPDATE_CATEGORY
}
type FaqCategoriesListProps = {
  id: string
  title: string
  description: string
  metadata: Record<string, any>
  handle: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  faqs: Omit<FaqProps, "category">[]
}

export class Faq {
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

  async listFaqs() {
    return await this.client.fetch<{ faqs: FaqProps[] }>(`/admin/faqs`, {
      method: "GET",
    })
  }

  async listFaqCategories() {
    return await this.client.fetch<{
      faqCategories: FaqCategoriesListProps[]
      count: number
    }>(`/admin/faqs/categories`, {
      method: "GET",
    })
  }

  async delete(id: string) {
    return await this.client.fetch(`/admin/faqs/${id}`, {
      method: "DELETE",
    })
  }

  async update(id: string, body: FAQ_UPDATE_TYPE) {
    return await this.client.fetch(`/admin/faqs/${id}`, {
      method: "PUT",
      body,
    })
  }

  async create(body: FAQ_TYPE) {
    return await this.client.fetch(`/admin/faqs`, {
      method: "POST",
      body,
    })
  }

  async retrieve(id: string) {
    return await this.client.fetch<FaqProps>(`/admin/faqs/${id}`, {
      method: "GET",
    })
  }
}
