const express = require("express")
const { serve } = require("./src/lib/serve")

const app = express()
const PORT = process.env.PORT || 3000

// Initialize server
async function startServer() {
  // Serve the built files
  app.use(await serve({ outDir: "dist" }))

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

startServer()
