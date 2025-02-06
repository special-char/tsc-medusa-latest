import { Container, Heading, Text } from "@medusajs/ui"
import UploadModal from "./components/zipcode-list-table/upload-modal"
import { ZipcodeListTable } from "./components/zipcode-list-table"

export const ZipcodeList = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>Zipcode List</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Zipcode and Delivery Estimations
          </Text>
        </div>
        <UploadModal />
      </div>
      <ZipcodeListTable />
    </Container>
  )
}
