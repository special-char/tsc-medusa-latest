import {
  FindParams,
  HttpTypes,
  PaginatedResponse,
} from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Region {
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

  async list(
    queryParams?: FindParams & HttpTypes.AdminRegionFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<
      PaginatedResponse<{ regions: HttpTypes.AdminRegion[] }>
    >(`/vendors/regions`, {
      query: queryParams,
      headers,
    })
  }

}
