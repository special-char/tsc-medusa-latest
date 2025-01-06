import { useEffect, useMemo, useState } from "react"
import { DataTable } from "../../../../../../components/table/data-table"
import { sdk } from "../../../../../../lib/client"
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useQueryParams } from "../../../../../../hooks/use-query-params"

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
    const data = await sdk.admin.zipcode.list()
    return data // Assuming the API returns an array of zip codes
  } catch (error) {
    console.error("Error fetching zip codes:", error)
    return
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

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const queryObject = useQueryParams(["q"])

  const { q } = queryObject

  useEffect(() => {
    const getZipcodes = async () => {
      const fetchedZipcodes = await fetchZipcodes()
      // Update state or handle fetched zip codes as needed

      console.log({ fetchedZipcodes })

      if (fetchedZipcodes) {
        setZipcodes(fetchedZipcodes)
      }
    }
    getZipcodes()
  }, [])

  // Filtered data based on search term
  const filteredData = useMemo(() => {
    return q
      ? zipcodes?.data.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().includes(q.toLowerCase())
          )
        )
      : zipcodes?.data
  }, [zipcodes, q])

  const table = useReactTable({
    data: filteredData || [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  return (
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
  )
}
