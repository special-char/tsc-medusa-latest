import path from "path"
import express from "express"

const app = express()

const PORT = +process.env.PORT! || 5173

async function serve() {
  try {
    const bundler = await import("@medusajs/admin-bundler")

    const outDir = path.join(__dirname, "../public")

    const adminRoute = await bundler.serve({
      outDir,
    })
    app.use("/", adminRoute)
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {}
  return true
}

serve()
