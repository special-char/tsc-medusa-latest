// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEDUSA_ADMIN_BACKEND_URL: string
  readonly VITE_MEDUSA_STOREFRONT_URL: string
  readonly VITE_MEDUSA_V2: "true" | "false"
  readonly VITE_MEDUSA_CHATBOT_URL: string
  readonly VITE_MEDUSA_X_SYNC_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __BACKEND_URL__: string | undefined
declare const __STOREFRONT_URL__: string | undefined
declare const __BASE__: string
declare const __CHATBOT_URL__: string | undefined
declare const __X_SYNC_TOKEN__: string | undefined
