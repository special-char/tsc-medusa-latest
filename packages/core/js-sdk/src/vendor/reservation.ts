import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

class Reservation {
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
    query?: HttpTypes.AdminGetReservationsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReservationListResponse>(
      "/vendors/reservations",
      {
        method: "GET",
        query,
        headers,
      }
    )
  }
}

export default Reservation
