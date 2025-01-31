import { Client } from "../client"
import { ClientHeaders } from "../types"
type SeoDetails = {
  metaTitle: string
  metaDescription: string
  keywords: string
  metaViewport: string
  metaRobots: string
  structuredData: string
  feedData: string
  canonicalURL: string
  metaImage: File | Blob
  metaSocial: {
    id?: string
    title: string | null
    description: string | null
    image?: string | null
    socialNetwork: "Facebook" | "Twitter" | "Instagram"
    seo_details_id?: string
  }
}
export class CategorySeo {
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
    return this.client.fetch<any>(`/admin/category-seo/${id}`, {
      method: "GET",
      headers,
    })
  }

  async create(id: string, body: SeoDetails, headers?: ClientHeaders) {
    console.log("body:::::::::::", body)

    const formData = new FormData()

    formData.append("metaTitle", body.metaTitle || "")
    formData.append("metaDescription", body.metaDescription || "")
    formData.append("keywords", body.keywords || "")
    formData.append("metaViewport", body.metaViewport || "")
    formData.append("metaRobots", body.metaRobots || "")
    formData.append("structuredData", body.structuredData || "")
    formData.append("feedData", body.feedData || "")
    formData.append("canonicalURL", body.canonicalURL || "")

    if (
      body.metaSocial &&
      Array.isArray(body.metaSocial) &&
      body.metaSocial.length > 0
    ) {
      console.log({ body })

      formData.append(
        "metaSocial",
        JSON.stringify(
          body.metaSocial.map((item: any, index: number) => ({
            ...item,
            index,
          }))
        )
      )
      body.metaSocial.forEach((item: any, index) => {
        if (item.image?.[0] && item.image?.[0] instanceof File) {
          formData.append(
            "files",
            item.image?.[0],
            `${item.id ?? `new_item_${index}_newMetaSocial`}.metaSocial.image.${
              item.image?.[0]?.name
            }`
          )
        }
      })
    }
    console.log({ formData })

    if (typeof body.metaImage === "string" || !body.metaImage) {
      console.log("deleted imagecanonical_URL", body.metaImage)
      formData.append("metaImage", body.metaImage ?? null)
    }

    if (body.metaImage?.[0] && body.metaImage?.[0] instanceof File) {
      formData.append("files", body.metaImage?.[0], body.metaImage?.[0]?.name)
    }

    console.log(
      "formData:::::::::::;;;",
      formData.get("metaTitle"),
      formData.forEach((value) => {
        console.log(value)
      })
    )

    return this.client.fetch<any>(`/admin/category-seo/${id}`, {
      method: "POST",
      headers: {
        "content-type": null,
      },
      body: formData,
    })
  }

  async update(
    id: string,
    seoId: string,
    body: SeoDetails,
    headers?: ClientHeaders
  ) {
    const formData = new FormData()

    formData.append("metaTitle", body.metaTitle || "")
    formData.append("metaDescription", body.metaDescription || "")
    formData.append("keywords", body.keywords || "")
    formData.append("metaViewport", body.metaViewport || "")
    formData.append("metaRobots", body.metaRobots || "")
    formData.append("structuredData", body.structuredData || "")
    formData.append("feedData", body.feedData || "")
    formData.append("canonicalURL", body.canonicalURL || "")

    if (
      body.metaSocial &&
      Array.isArray(body.metaSocial) &&
      body.metaSocial.length > 0
    ) {
      formData.append(
        "metaSocial",
        JSON.stringify(
          body.metaSocial.map((item: any, index: number) => ({
            ...item,
            index,
          }))
        )
      )
      body.metaSocial.forEach((item: any, index) => {
        if (item.image?.[0] && item.image?.[0] instanceof File) {
          formData.append(
            "files",
            item.image?.[0],
            `${item.id ?? `new_item_${index}_newMetaSocial`}.metaSocial.image.${
              item.image?.[0]?.name
            }`
          )
        }
      })
    }

    if (typeof body.metaImage === "string" || !body.metaImage) {
      console.log("deleted imagecanonical_URL", body.metaImage)
      formData.append("metaImage", body.metaImage ?? null)
    }

    if (body.metaImage?.[0] && body.metaImage?.[0] instanceof File) {
      formData.append("files", body.metaImage?.[0], body.metaImage?.[0]?.name)
    }

    return this.client.fetch<any>(`/admin/category-seo/${id}/${seoId}`, {
      method: "PUT",
      headers: {
        "content-type": null,
      },
      body: formData,
    })
  }
}
