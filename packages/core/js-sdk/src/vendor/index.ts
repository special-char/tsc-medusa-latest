import { Client } from "../client"
import { ClientHeaders } from "../types"
import { Collection } from "./collection"
import { InventoryItem } from "./inventory-item"
import { ProductCategory } from "./product-category"
import { ProductTags } from "./product-tag"
import { ProductTypes } from "./product-type"
import { Region } from "./region"
import Reservation from "./reservation"
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
  public inventoryItem: InventoryItem
  public reservation: Reservation
  public region: Region
  constructor(client: Client) {
    this.client = client
    this.productCollection = new Collection(client)
    this.productCategory = new ProductCategory(client)
    this.productTag = new ProductTags(client)
    this.productType = new ProductTypes(client)
    this.inventoryItem = new InventoryItem(client)
    this.reservation = new Reservation(client)
    this.region = new Region(client)
  }

  async create(data: any, headers?: ClientHeaders) {
    const formData = new FormData()
    formData.append("logo", data.logo[0])
    formData.append("email", data.email)
    formData.append("first_name", data.first_name)
    formData.append("last_name", data.last_name)
    formData.append("category", data.category)
    formData.append("address", data.address)
    formData.append("postal_code", data.postal_code)
    formData.append("city", data.city)
    formData.append("country", data.country)
    formData.append("state", data.state)
    formData.append("commission", data.commission)
    formData.append("description", data.description)
    formData.append("handle", data.handle)
    formData.append("name", data.name)

    return this.client.fetch<any>(`/vendors/vendor-create`, {
      headers: {
        "content-type": null,
      },
      method: "POST",
      body: formData,
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
