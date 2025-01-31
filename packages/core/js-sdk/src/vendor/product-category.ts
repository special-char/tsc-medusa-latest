import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ProductCategory {
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
        query?: HttpTypes.AdminProductCategoryListParams,
        headers?: ClientHeaders
    ) {
        return this.client.fetch<HttpTypes.AdminProductCategoryListResponse>(
            `/vendors/product-categories`,
            {
                headers,
                query: query,
            }
        )
    }

}
