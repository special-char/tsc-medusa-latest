import path from "path"
import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const PORT = +process.env.PORT! || 5173

async function build() {
  try {
    const bundler = await import("@medusajs/admin-bundler")

    const sources = [path.resolve(__dirname, "../..")]
    const outDir = path.join(__dirname, "../public/admin")

    await bundler.build({
      path: "/",
      backendUrl: process.env.MEDUSA_BACKEND_URL,
      storefrontUrl: process.env.MEDUSA_STOREFRONT_URL,
      sources,
      outDir,
    })

    const adminRoute = await bundler.serve({
      outDir,
    })

    app.use("/", adminRoute)

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

build()
