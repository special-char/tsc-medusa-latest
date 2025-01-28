import { Client } from "../client"
import { ClientHeaders } from "../types"
import { Collection } from "./collection"
import { ProductCategory } from "./product-category"
import { ProductTags } from "./product-tag"
import { ProductTypes } from "./product-type";
export class Vendor {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  public productCollection: Collection
  public productCategory: ProductCategory
  public productTag: ProductTags
  public productType: ProductTypes
  constructor(client: Client) {
    this.client = client
    this.productCollection = new Collection(client)
    this.productCategory = new ProductCategory(client)
    this.productTag = new ProductTags(client)
    this.productType = new ProductTypes(client)
  }

  async create(data: any, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/vendors/vendor-create`, {
      headers,
      method: "POST",
      body: data,
    })
  }

  async retrieve(headers?: ClientHeaders) {
    return this.client.fetch<any>(`/vendors`, {
      headers,
    })
  }

  async retrieveById(id: string, headers?: ClientHeaders) {
    return this.client.fetch<any>(`/vendors/${id}`, {
      headers,
    })
  }
}
