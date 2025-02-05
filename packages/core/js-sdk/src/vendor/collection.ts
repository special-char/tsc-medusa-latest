import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Collection {
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
        query?: HttpTypes.AdminCollectionListParams,
        headers?: ClientHeaders
    ) {
        return this.client.fetch<HttpTypes.AdminCollectionListResponse>(
            `/vendors/collection`,
            {
                headers,
                query: query,
            }
        )
    }

}
