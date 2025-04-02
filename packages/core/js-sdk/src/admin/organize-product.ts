import { Client } from "../client"

export class OrganizeProduct {
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

  // async list() {
  //   return await this.client.fetch<>(`/admin/organize-product`, {
  //     method: "GET",
  //   })
  // }

  async create(body: {
    rank_type_id?: string
    rank_type: string
    productRankMap: {
      id: string
      title: string
      handle: string
      entity_ranks: {
        id: string
        entity_id: string
        rank: 2
        rank_type: string
        rank_type_id?: string
        metadata: null
      }[]
      product_rank: 0
    }[]
  }) {
    return await this.client.fetch(`/admin/organize-product`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body,
    })
  }
}
