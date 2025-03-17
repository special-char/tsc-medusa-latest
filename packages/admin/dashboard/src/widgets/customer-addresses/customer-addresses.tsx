import { Container, Heading } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/framework/types"
import { useCustomerAddresses } from "../../hooks/api"
import {
  DataTable,
  useDataTable,
  createDataTableColumnHelper,
} from "@medusajs/ui"
import { PencilSquare, Trash } from "@medusajs/icons"
import { ActionMenu } from "../../components/common/action-menu"
import { t } from "i18next"
import { sdk } from "../../lib/client"
import { useNavigate } from "react-router-dom"

const CustomerAddressesWidget = ({
  customer,
}: {
  customer: HttpTypes.AdminCustomer
}) => {
  const { addresses } = useCustomerAddresses(customer?.id)
  const navigate = useNavigate()

  const data = addresses?.addresses || []

  const columnHelper = createDataTableColumnHelper<(typeof data)[0]>()

  const handleDelete = async (id: string, address_id: string) => {
    await sdk.admin.customer.deleteAddress(id, address_id)
    navigate(0)
  }

  const columns = [
    columnHelper.accessor("first_name", {
      header: "First Name",
    }),
    columnHelper.accessor("last_name", {
      header: "Last Name",
    }),
    columnHelper.accessor("company", {
      header: "Company",
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
    }),
    columnHelper.accessor("address_1", {
      header: "Address1",
    }),
    columnHelper.accessor("address_2", {
      header: "Address2",
    }),
    columnHelper.accessor("city", {
      header: "City",
    }),
    columnHelper.accessor("province", {
      header: "Province",
    }),
    columnHelper.accessor("postal_code", {
      header: "Postal Code",
    }),
    columnHelper.accessor("country_code", {
      header: "Country Code",
    }),
    columnHelper.accessor("metadata.cpf", {
      header: "Cpf",
    }),
    columnHelper.accessor("metadata.number", {
      header: "Number",
    }),
    columnHelper.accessor("metadata.complement", {
      header: "Complement",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell({ row }) {
        const customerId = row.original.customer_id
        const addressId = row.original.id

        return (
          <div className="px-2">
            <ActionMenu
              groups={[
                {
                  actions: [
                    {
                      label: t("actions.edit"),
                      icon: <PencilSquare />,
                      to: `edit-address/${addressId}`,
                    },
                  ],
                },
                {
                  actions: [
                    {
                      label: t("actions.delete"),
                      icon: <Trash />,
                      onClick: () => handleDelete(customerId, addressId),
                    },
                  ],
                },
              ]}
            />
          </div>
        )
      },
    }),
  ]

  const table = useDataTable({
    columns,
    data,
    getRowId: (product) => product.id,
    rowCount: data.length,
    isLoading: false,
  })

  return (
    <Container className="divide-y p-0 font-sans">
      <Heading level="h2" className="px-6 py-4 font-medium">
        Customer Addresses
      </Heading>
      <div className="w-full px-4 py-4">
        <DataTable instance={table}>
          <DataTable.Table
            emptyState={{
              empty: {
                heading: "This customer doesn't have any address",
              },
            }}
          />
        </DataTable>
      </div>
    </Container>
  )
}

export default CustomerAddressesWidget
