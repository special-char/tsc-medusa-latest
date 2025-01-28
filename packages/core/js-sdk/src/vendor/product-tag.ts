import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ProductTags {
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
        query?: HttpTypes.AdminProductTagListParams,
        headers?: ClientHeaders
    ) {
        return this.client.fetch<HttpTypes.AdminProductTagListResponse>(
            `/vendors/product-tags`,
            {
                headers,
                query: query,
            }
        )
    }

}
