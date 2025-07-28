import { FindParams, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export interface Cepcode {
  id: string
  cep_initial: string
  cep_final: string
  uf: string
  ibge_code: string
  ibge_name: string
  ibge_base: string
  risk: string
  time: string
  service_type: string
  commercial_location: string
  commercial_geography: string
  metadata?: Record<string, any> | null
  created_at?: string
  updated_at?: string
}

export interface CepcodesResponse {
  cepcodes: Cepcode[]
  count: number
  limit: number
  offset: number
}

export class Zipcode {
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

  async upload(
    body:
      | {
          name: string
          content: string
        }
      | File,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    const form = new FormData()
    if (body instanceof File) {
      form.append("file", body)
    } else {
      form.append(
        "files",
        "content" in body
          ? new Blob([body.content], {
              type: "text/plain",
            })
          : body,
        body.name
      )
    }

    return this.client.fetch<string>(`/admin/zipcodes`, {
      method: "POST",
      headers: {
        ...headers,
        // Let the browser determine the content type.
        "content-type": null,
      },
      body: form,
      query,
    })
  }

  async list(queryParams?: FindParams, headers?: ClientHeaders) {
    return await this.client.fetch<CepcodesResponse>(`/admin/zipcodes`, {
      query: queryParams,
      headers,
    })
  }
}
