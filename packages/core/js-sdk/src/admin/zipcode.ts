import { FindParams, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export type ZipcodeType = {
  CEPInicial: number
  CEPFinal: number
  UF: string
  IBGEdoMunicípio: string
  NomedoMunicípio: string
  Base: string
  Risco: string
  Prazo: string
  TipodeAtendimento: string
  LocalidadeComercial: string
  GeografiaComercial: string
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
    return await this.client.fetch<{ data: ZipcodeType[]; count: number }>(
      `/admin/zipcodes`,
      {
        query: queryParams,
        headers,
      }
    )
  }
}
