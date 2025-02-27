import { Client } from "../client"
import { ClientHeaders } from "../types"

export class NotificationTemplate {
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

    async listTemplate(queryParams?: any, headers?: ClientHeaders) {
        return await this.client.fetch<any>(`/admin/notification-template`, {
            headers,
            query: queryParams,
        })
    }
    async listEvent(queryParams?: any, headers?: ClientHeaders) {
        return await this.client.fetch<any>(`/admin/notification-event`, {
            headers,
            query: queryParams,
        })
    }
}
