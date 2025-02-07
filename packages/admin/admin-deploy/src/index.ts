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
      backendUrl: process.env.BACKEND_URL,
      storefrontUrl: process.env.STOREFRONT_URL,
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
