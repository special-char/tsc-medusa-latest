import { Button, Container, Heading, Table } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link, Outlet, useNavigate } from "react-router-dom"
import GiftTable from "./GiftTemplateTable"
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"

const getGiftTemplates = async () => {
  try {
    const response = await fetch(`${__BACKEND_URL__}/admin/gift-templates`, {
      credentials: "include",
    })
    const res = await response.json()
    return res
  } catch (error) {
    console.log(error)
  }
}

const deleteGiftTemplates = async (id: string) => {
  try {
    const response = await fetch(
      `${__BACKEND_URL__}/admin/gift-templates/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    const res = await response.json()
    console.log({ res }, "delete template")
  } catch (error) {
    console.log(error)
  }
}

export const GiftTemplateTable = () => {
  const { t } = useTranslation()
  const [giftTemplates, setGiftTemplates] = useState([])

  const navigate = useNavigate()

  const onDelete = async (id: string) => {
    try {
      await deleteGiftTemplates(id)
    } catch (error) {
      console.log("onDelete error", error)
    }
  }
  const columnHelper = createColumnHelper<any>()

  const columns = [
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => (
        <span className="w-[200px] overflow-hidden line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("content", {
      header: "Content",
      cell: (info) => (
        <span className="w-[200px] overflow-hidden line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),

    columnHelper.display({
      header: "Actions",
      id: "actions",
      cell: (info) => {
        const templateId = info.row.original.id
        return (
          <div className="flex w-[200px] gap-5">
            <>
              <button
                className="bg-green-500 text-white p-2 rounded-lg"
                onClick={() => {
                  navigate("/gift-templates/edit", { state: info.row.original })
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded-lg"
                onClick={async () => {
                  console.log("Delete template id", templateId)
                  await onDelete(info.row.original?.id)
                  navigate(0)
                }}
              >
                Delete
              </button>
            </>
          </div>
        )
      },
    }),
  ]

  const PAGE_SIZE = 10

  const table = useReactTable<any>({
    data: giftTemplates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect(() => {
    getGiftTemplates().then((res) => setGiftTemplates(res.data))
  }, [])

  return (
    <Container className="overflow-scroll p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("giftTemplates.label")}</Heading>
        <div className="flex items-center justify-center gap-x-2">
          <Button size="small" variant="primary" asChild>
            <Link to="create">Add Template</Link>
          </Button>
        </div>
      </div>
      <GiftTable
        PAGE_SIZE={PAGE_SIZE}
        data={giftTemplates}
        table={table}
        heading={"Template List"}
      />
      <Outlet />
    </Container>
  )
}
