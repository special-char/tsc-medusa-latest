import { Button, Container, Heading } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { sdk } from "../../../../../lib/client"
import { Link, Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"
import CustomTable from "../../../../../components/common/CustomTable"
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import BannerActions from "../banner-actions/banner.actions"
import { SquareGreenSolid, SquareGreySolid } from "@medusajs/icons"

export type BannerProps = {
  id: string
  name: string
  link?: string
  image?: string | null
  text?: string
  isActive?: boolean
}

export const BannerListTable = () => {
  const [banners, setBanners] = useState<BannerProps[]>([])
  const LoadBannerData = async () => {
    try {
      const bannerResponse = await sdk.admin.banner.list()

      setBanners(bannerResponse?.bannerList)
    } catch (error: any) {
      console.log(`Failed to fetch banner data:${error}`)
    }
  }
  useEffect(() => {
    LoadBannerData()
  }, [])

  const columnHelper = createColumnHelper<any>()
  const columns = [
    columnHelper.display({
      header: "Sr. No.",
      id: "sr_no",
      cell: (info) => info.row.index + 1,
    }),
    columnHelper.accessor("isActive", {
      header: "Status",
      cell: (info) => {
        return (
          <span className="line-clamp-1 overflow-hidden">
            {info.getValue() === true ? (
              <div className="flex items-center">
                <SquareGreenSolid />
                Published
              </div>
            ) : (
              <div className="flex items-center">
                <SquareGreySolid />
                Draft
              </div>
            )}
          </span>
        )
      },
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("link", {
      header: "Link",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("text", {
      header: "Text",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("updated_at", {
      header: "Last Updated",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      header: "Actions",
      id: "actions",
      cell: (info) => {
        return <BannerActions banner={info.row.original} />
      },
    }),
  ]

  const table = useReactTable<any>({
    data: banners,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const { t } = useTranslation()
  return (
    <Container className="divide-y overflow-hidden p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Banner</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      {banners.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-4 py-12 text-center">
          <h3 className="text-xl font-semibold tracking-tight">
            No Banners found
          </h3>
          <p className="text-muted-foreground text-sm">
            Get started by creating your first Banner to help your users.
          </p>
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
      ) : (
        <CustomTable PAGE_SIZE={10} data={banners} table={table} />
      )}
      <Outlet />
    </Container>
  )
}
