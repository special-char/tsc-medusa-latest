import { Admin } from "./admin"
import { Auth } from "./auth"
import { Client } from "./client"
import { Store } from "./store"
import { Config } from "./types"
import { Vendor } from "./vendor"

class Medusa {
  public client: Client

  public admin: Admin
  public store: Store
  public auth: Auth
  public vendor: Vendor

  constructor(config: Config) {
    this.client = new Client(config)

    this.admin = new Admin(this.client)
    this.store = new Store(this.client)
    this.auth = new Auth(this.client, config)
    this.vendor = new Vendor(this.client)
  }
}

export default Medusa

export { FetchError, Client } from "./client"
export { Admin } from "./admin"
export { Auth } from "./auth"
export { Store } from "./store"
export { Vendor } from "./vendor"
export {
  Config,
  ClientHeaders,
  ClientFetch,
  FetchArgs,
  FetchInput,
  FetchStreamResponse,
  Logger,
  ServerSentEventMessage,
} from "./types"
