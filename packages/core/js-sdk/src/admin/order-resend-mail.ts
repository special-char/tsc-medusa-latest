import { AdminOrderLineItem } from "@medusajs/types"
import { Client } from "../client"
type OrderResendMailProps = {
  phone: string
  email: string
  template: string
  data: AdminOrderLineItem
  redemptionData: Record<string, any>
}
export class OrderResendMail {
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

  async create(body: OrderResendMailProps) {
    return await this.client.fetch(`/admin/resend-email`, {
      method: "POST",
      body,
    })
  }
}
