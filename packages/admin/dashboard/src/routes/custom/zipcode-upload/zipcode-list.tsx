import { Container, Heading, Text } from "@medusajs/ui"
import DataTable from "./components/data-table"
import UploadModal from "./components/upload-modal"

export const ZipcodeList = () => {
  return (
    <Container className="divide-y p-0">
      {/* <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <Heading level="h1" className="pb-2 font-semibold">
            Upload Zipcode CSV file
          </Heading>

          <UploadModal />
        </div> */}

      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>Zipcode List</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Zipcode and Delivery Estimations
          </Text>
        </div>
        <UploadModal />
      </div>
      <DataTable />
    </Container>
  )
}
