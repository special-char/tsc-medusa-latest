import path from "path"
import dotenv from "dotenv"

dotenv.config()

async function build() {
  try {
    const bundler = await import("@medusajs/admin-bundler")

    const sources = [path.resolve(__dirname, "../..")]
    const outDir = path.join(__dirname, "../public")

    await bundler.build({
      path: "/",
      backendUrl: "https://yogateria.medusajs.app",
      storefrontUrl: "https://test.yogateria.com.br",
      // storefrontUrl: "https://yogateria-storefront.vercel.app",
      chatbotUrl: "http://j1107siiainx8tdly8ib6e8m.62.72.13.4.sslip.io",
      xSyncToken: "kCk8I5dZdQYUCJRoJgW6rcn2owhpMENEkaBbzDkFr/4=",
      sources,
      outDir,
      vite: undefined,
    })
  } catch (error) {
    console.log(error)
  }

  return true
}

build()
