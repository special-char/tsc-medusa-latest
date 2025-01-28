import { Client } from "../client"
import { ClientHeaders } from "../types"

export class BlogSeo {
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

  async retrieveById(id: string, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/admin/blog-seo/${id}`, {
      method: "GET",
      headers,
    })
  }

  async create({
    id,
    body,
  }: {
    id: string
    body: {
      metaTitle: string
      metaDescription: string
      keywords: string
      metaViewport: string
      metaRobots: string
      structuredData: string
      canonicalURL: string
      metaImage: { file: File | Blob }
      metaSocial: {
        id?: string
        title: string | null
        description: string | null
        image?: string | null
        socialNetwork: "Facebook" | "Twitter"
        seo_details_id?: string
      }
    }
  }) {
    const formdata = new FormData()
    formdata.append("metaTitle", body.metaTitle)
    formdata.append("metaDescription", body.metaDescription)
    formdata.append("metaImage", body.metaImage.file)
    formdata.append("keywords", body.keywords)
    formdata.append("metaRobots", body.metaRobots)
    formdata.append("structuredData", body.structuredData)
    formdata.append("metaViewport", body.metaViewport)
    formdata.append("canonicalURL", body.canonicalURL)
    if (
      body.metaSocial &&
      Array.isArray(body.metaSocial) &&
      body.metaSocial.length > 0
    ) {
      formdata.append(
        "metaSocial",
        JSON.stringify(
          body.metaSocial.map((item: any, index: number) => ({
            ...item,
            index,
          }))
        )
      )
      body.metaSocial.forEach((item: any) => {
        if (item.image?.[0] && item.image?.[0] instanceof File) {
          formdata.append("metaSocialImage", item.image?.[0])
        }
      })
    }
    console.log("createSeoData", formdata)

    return this.client.fetch<any>(`/admin/blog-seo/${id}`, {
      method: "POST",
      headers: {
        "content-type": null,
      },
      body: formdata,
    })
  }

  async update({
    id,
    seoId,
    body,
  }: {
    id: string
    seoId: string
    body: {
      metaTitle: string
      metaDescription: string
      keywords: string
      metaViewport: string
      metaRobots: string
      structuredData: string
      canonicalURL: string
      metaImage: { file: File | Blob } | string
      metaSocial: {
        id?: string
        title: string | null
        description: string | null
        image?: string | null
        socialNetwork: "Facebook" | "Twitter"
        seo_details_id?: string
      }
    }
  }) {
    console.log("====================================")
    console.log("body", body)
    console.log("====================================")
    const formdata = new FormData()
    formdata.append("metaTitle", body.metaTitle)
    formdata.append("metaDescription", body.metaDescription)
    formdata.append(
      "metaImage",
      typeof body.metaImage === "string" ? body.metaImage : body.metaImage.file
    )
    formdata.append("keywords", body.keywords)
    formdata.append("metaRobots", body.metaRobots)
    formdata.append("structuredData", body.structuredData)
    formdata.append("metaViewport", body.metaViewport)
    formdata.append("canonicalURL", body.canonicalURL)
    if (
      body.metaSocial &&
      Array.isArray(body.metaSocial) &&
      body.metaSocial.length > 0
    ) {
      formdata.append(
        "metaSocial",
        JSON.stringify(
          body.metaSocial.map((item: any, index: number) => ({
            ...item,
            index,
          }))
        )
      )
      body.metaSocial.forEach((item: any) => {
        if (typeof item.image === "string") {
          formdata.append("metaSocialImage", item.image)
        } else {
          if (item.image?.[0] && item.image?.[0] instanceof File) {
            formdata.append("metaSocialImage", item.image?.[0])
          }
        }
      })
    }
    console.log("updateSeoData", formdata)
    return this.client.fetch<any>(`/admin/blog-seo/${id}/${seoId}`, {
      method: "PUT",
      headers: {
        "content-type": null,
      },
      body: formdata,
    })
  }
}
