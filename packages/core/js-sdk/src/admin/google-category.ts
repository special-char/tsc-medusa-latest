import { Client } from "../client"

export type GoogleCategoryType = {
  id: number
  path: string
}

export class GoogleCategory {
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
    return await this.client.fetch<{
      googleCategories: GoogleCategoryType[]
      count: number
    }>(`/admin/google-category`)
  }

  async retrieveById({ id }: { id: string }) {
    return await this.client.fetch<{
      googleCategoryId: number
      category: GoogleCategoryType
    }>(`/admin/google-category/${id}`)
  }
}
