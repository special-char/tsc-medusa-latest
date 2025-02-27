import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Role {
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

    async list(query?: any, headers?: ClientHeaders) {
        return await this.client.fetch(
            `/admin/client-role`,
            {
                query,
                headers,
            }
        )
    }


}
