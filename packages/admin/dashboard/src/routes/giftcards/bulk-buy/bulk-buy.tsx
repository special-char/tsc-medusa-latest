import { Button, Container, Heading } from "@medusajs/ui"
import { Link, Outlet } from "react-router-dom"

export const Bulkbuy = () => {
  return (
    <div className="p-0 flex flex-col gap-4">
      <Container className="flex justify-between gap-6 p-8">
        <Heading level="h2" className="font-bold">
          Are you ready to Buy Bulk Gift Cards?
        </Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="import">Import</Link>
        </Button>
        <Outlet />
      </Container>
    </div>
  )
}
