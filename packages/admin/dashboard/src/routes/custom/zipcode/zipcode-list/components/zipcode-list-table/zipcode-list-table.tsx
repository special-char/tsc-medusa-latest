import { createColumnHelper } from "@tanstack/react-table"
import { useCepcodes } from "../../hooks/useCepcodes"
import { useCepcodesTableQuery } from "../../hooks/useCepcodesTableQuery"
import { Cepcode } from "../../../types"
import { useDataTable } from "../../../../../../hooks/use-data-table"
import { _DataTable } from "../../../../../../components/table/data-table"

const PAGE_SIZE = 10

// const columns = [
//   {
//     accessorKey: "CEPInicial", // Accessor for the initial ZIP code
//     header: "CEP Inicial",
//   },
//   {
//     accessorKey: "CEPFinal", // Accessor for the final ZIP code
//     header: "CEP Final",
//   },
//   {
//     accessorKey: "UF", // Accessor for the state
//     header: "UF",
//   },
//   {
//     accessorKey: "IBGEdoMunicípio", // Accessor for the IBGE code
//     header: "IBGE do Município",
//   },
//   {
//     accessorKey: "NomedoMunicípio", // Accessor for the municipality name
//     header: "Nome do Município",
//   },
//   {
//     accessorKey: "Base", // Accessor for the base
//     header: "Base",
//   },
//   {
//     accessorKey: "Risco", // Accessor for the risk level
//     header: "Risco",
//   },
//   {
//     accessorKey: "Prazo", // Accessor for the deadline
//     header: "Prazo",
//   },
//   {
//     accessorKey: "TipodeAtendimento", // Accessor for the type of service
//     header: "Tipo de Atendimento",
//   },
//   {
//     accessorKey: "LocalidadeComercial", // Accessor for the commercial locality
//     header: "Localidade Comercial",
//   },
//   {
//     accessorKey: "GeografiaComercial", // Accessor for the commercial geography
//     header: "Geografia Comercial",
//   },
// ]

export const ZipcodeListTable = () => {
  const { searchParams, raw } = useCepcodesTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { cepcodes, count, isError, error, isLoading } = useCepcodes({
    ...searchParams,
  })

  const columnHelper = createColumnHelper<Cepcode>()
  const columns = [
    columnHelper.accessor("cep_initial", {
      header: "CEP Inicial",
      cell: ({ getValue }) => {
        const cepInitial = getValue()
        return (
          <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{cepInitial}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("cep_final", {
      header: "CEP Final",
      cell: ({ getValue }) => {
        const cepFinal = getValue()
        return (
          <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{cepFinal}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("uf", {
      header: "UF",
      cell: ({ getValue }) => {
        const uf = getValue()
        return (
          <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{uf}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("ibge_code", {
      header: "IBGE do Município",
      cell: ({ getValue }) => {
        const ibgeCode = getValue()
        return (
          <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{ibgeCode}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("ibge_name", {
      header: "Nome do Município",
      cell: ({ getValue }) => {
        const ibgeName = getValue()
        return (
          <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{ibgeName}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("ibge_base", {
      header: "Base",
      cell: ({ getValue }) => {
        const ibgeBase = getValue()
        return (
          <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{ibgeBase}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("risk", {
      header: "Risco",
      cell: ({ getValue }) => {
        const risk = getValue()
        return (
          <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{risk}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("time", {
      header: "Prazo",
      cell: ({ getValue }) => {
        const time = getValue()
        return (
          <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{time}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("service_type", {
      header: "Tipo de Atendimento",
      cell: ({ getValue }) => {
        const serviceType = getValue()
        return (
          <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{serviceType}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("commercial_location", {
      header: "Localidade Comercial",
      cell: ({ getValue }) => {
        const commercialLocation = getValue()
        return (
          <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{commercialLocation}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("commercial_geography", {
      header: "Geografia Comercial",
      cell: ({ getValue }) => {
        const commercialGeography = getValue()
        return (
          <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{commercialGeography}</span>
          </div>
        )
      },
    }),
  ]

  const { table } = useDataTable({
    data: cepcodes ?? [],
    columns,
    enablePagination: true,
    count,
    pageSize: PAGE_SIZE,
  })

  return (
    <_DataTable
      table={table}
      columns={columns}
      count={count}
      pageSize={PAGE_SIZE}
      filters={[]} // Add filters if needed
      search
      pagination
      isLoading={isLoading}
      queryObject={raw}
      noRecords={{
        message: "No records found", // Customize no records message
      }}
    />
  )
}
