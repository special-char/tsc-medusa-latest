import { Client } from "../client"

type AMCType = {
  variant_id: string[]
  title: string
  sku: string
  barcode: string
  prices: AMCPrice[]
}
type AMCPrice = {
  currency_code: string
  amount: number
}
type AMCPriceRawAmount = {
  id: string
  title: null
  currency_code: string
  min_quantity: number | null
  max_quantity: number | null
  rules_count: number
  price_set_id: string
  price_list_id: string | null
  price_list: string | null
  raw_amount: {
    value: string
    precision: number
  }
  created_at: string
  updated_at: string
  deleted_at: string | null
  amount: number
}
type AMCProps = {
  id: string
  title: string
  sku: string
  barcode: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  price_set: {
    id: string
    prices: AMCPriceRawAmount[]
  }
}

type UPDATE_AMC_TYPE = {
  title?: string
  sku?: string
  barcode?: string
  prices?: AMCPrice[]
  variant_id?: string[]
}

export class AMC {
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
    return await this.client.fetch<{ amcs: AMCProps[] }>(`/admin/amc`, {
      method: "GET",
    })
  }

  async delete(id: string) {
    return await this.client.fetch(`/admin/amc/${id}`, {
      method: "DELETE",
    })
  }

  async update(id: string, body: UPDATE_AMC_TYPE) {
    return await this.client.fetch(`/admin/amc/${id}`, {
      method: "POST",
      body: body,
    })
  }

  async create(body: AMCType) {
    return await this.client.fetch(`/admin/amc`, {
      method: "POST",
      body,
    })
  }

  async retrieve(id: string) {
    return await this.client.fetch<AMCProps>(`/admin/amc/${id}`, {
      method: "GET",
    })
  }
}
