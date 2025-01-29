import path from "path"
// import express from "express"
import dotenv from "dotenv"

dotenv.config()

// const app = express()

// const PORT = +process.env.PORT! || 5173

async function build() {
  try {
    const bundler = await import("@medusajs/admin-bundler")

    const sources = [path.resolve(__dirname, "../..")]
    const outDir = path.join(__dirname, "../public")

    await bundler.build({
      path: "/",
      backendUrl: "https://yogateria.medusajs.app",
      storefrontUrl: "https://yogateria-v2-storefront.vercel.app",
      sources,
      outDir,
      vite: undefined,
    })

    // const adminRoute = await bundler.serve({
    //   outDir,
    // })

    // app.use("/", adminRoute)

    // app.listen(PORT, () => {
    //   console.log(`Server is running on http://localhost:${PORT}`)
    // })
  } catch (error) {
    console.log(error)
  }

  return true
}

build()
