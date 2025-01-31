import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ProductTypes {
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
        query?: HttpTypes.AdminProductTypeListParams,
        headers?: ClientHeaders
    ) {
        return this.client.fetch<HttpTypes.AdminProductTypeListResponse>(
            `/vendors/product-types`,
            {
                headers,
                query: query,
            }
        )
    }

}
