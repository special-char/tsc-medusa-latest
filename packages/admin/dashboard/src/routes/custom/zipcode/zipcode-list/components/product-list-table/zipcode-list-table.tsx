import { useEffect, useState } from "react"
import { DataTable } from "../../../../../../components/table/data-table"
import { useDataTable } from "../../../../../../hooks/use-data-table"
import { Container, Heading, Text } from "@medusajs/ui"
import axios from "axios" // Add axios import
import { backendUrl } from "../../../../../../lib/client"

const PAGE_SIZE = 20

type ZipcodeType = {
  CEPInicial: number
  CEPFinal: number
  UF: string
  IBGEdoMunicípio: string
  NomedoMunicípio: string
  Base: string
  Risco: string
  Prazo: string
  TipodeAtendimento: string
  LocalidadeComercial: string
  GeografiaComercial: string
}

const fetchZipcodes = async () => {
  try {
    const response = await axios.get(`${backendUrl}/admin/zipcodes`, {
      withCredentials: true, // Use withCredentials for including cookies
    }) // Replace with your API endpoint

    const data = response.data // Access data directly from the response
    return data // Assuming the API returns an array of zip codes
  } catch (error) {
    console.error("Error fetching zip codes:", error)
    return [] // Return an empty array in case of error
  }
}

const columns = [
  {
    accessorKey: "CEPInicial", // Accessor for the initial ZIP code
    header: "CEP Inicial",
  },
  {
    accessorKey: "CEPFinal", // Accessor for the final ZIP code
    header: "CEP Final",
  },
  {
    accessorKey: "UF", // Accessor for the state
    header: "UF",
  },
  {
    accessorKey: "IBGEdoMunicípio", // Accessor for the IBGE code
    header: "IBGE do Município",
  },
  {
    accessorKey: "NomedoMunicípio", // Accessor for the municipality name
    header: "Nome do Município",
  },
  {
    accessorKey: "Base", // Accessor for the base
    header: "Base",
  },
  {
    accessorKey: "Risco", // Accessor for the risk level
    header: "Risco",
  },
  {
    accessorKey: "Prazo", // Accessor for the deadline
    header: "Prazo",
  },
  {
    accessorKey: "TipodeAtendimento", // Accessor for the type of service
    header: "Tipo de Atendimento",
  },
  {
    accessorKey: "LocalidadeComercial", // Accessor for the commercial locality
    header: "Localidade Comercial",
  },
  {
    accessorKey: "GeografiaComercial", // Accessor for the commercial geography
    header: "Geografia Comercial",
  },
]

export const ZipcodeListTable = () => {
  // const zipcodes: ZipcodeType[] = []

  const [zipcodes, setZipcodes] = useState<{
    data: ZipcodeType[]
    count: number
  } | null>(null)

  useEffect(() => {
    const getZipcodes = async () => {
      const fetchedZipcodes = await fetchZipcodes()
      // Update state or handle fetched zip codes as needed

      console.log({ fetchedZipcodes })

      setZipcodes(fetchedZipcodes)
    }
    getZipcodes()
  }, [])

  const { table } = useDataTable({
    data: (zipcodes?.data ?? []) as ZipcodeType[],
    columns, // Use the defined columns here
    count: zipcodes?.count ?? 0,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row?.CEPInicial.toString() || "",
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>Zipcodes List</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Zipcodes and Delivery Estimations
          </Text>
        </div>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={zipcodes?.count}
        pageSize={PAGE_SIZE}
        filters={[]} // Add filters if needed
        search
        pagination
        isLoading={false} // Set loading state as needed
        queryObject={{}} // Pass query object if applicable
        // navigateTo={(row) => `${row.original?.}`} // Define navigation logic
        // orderBy={[
        //   { key: "CEPInicial", label: "CEPInicial" },
        //   { key: "CEPFinal", label: "CEPFinal" },
        //   { key: "UF", label: "UF" },
        // ]}
        noRecords={{
          message: "No records found", // Customize no records message
        }}
      />
    </Container>
  )
}
