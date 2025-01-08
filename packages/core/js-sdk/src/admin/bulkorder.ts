import { AdminUser } from "@medusajs/types"
import { Client } from "../client"

export class BulkOrder {
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

  async upload(body: {
    files: File | Blob
    currency_code: string
    sales_channel_id: string
    region_id: string
    user: AdminUser
  }) {
    const formData = new FormData()
    if (body.files instanceof File || body.files instanceof Blob) {
      formData.append("files", body.files)
    } else {
      formData.append("currency_code", body.currency_code)
      formData.append("sales_channel_id", body.sales_channel_id)
      formData.append("region_id", body.region_id)
    }
    if (body.user) {
      formData.append("user", JSON.stringify(body.user))
    }

    return await this.client.fetch(`/admin/bulk-order`, {
      method: "POST",
      headers: {
        "content-type": null,
      },
      body: formData,
    })
  }
}
