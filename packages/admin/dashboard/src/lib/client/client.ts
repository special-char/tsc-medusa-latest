import Medusa from "@medusajs/js-sdk"

export const backendUrl = __BACKEND_URL__ ?? "/"
export const storefrontUrl = __STOREFRONT_URL__ ?? "/"
export const chatbotUrl = __CHATBOT_URL__ ?? "/"
export const xSyncToken = __X_SYNC_TOKEN__ ?? ""

export const sdk = new Medusa({
  baseUrl: backendUrl,
  auth: {
    type: "session",
  },
})

// useful when you want to call the BE from the console and try things out quickly
if (typeof window !== "undefined") {
  ;(window as any).__sdk = sdk
}
