import { Button, Container, Heading, Table } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { DateCell } from "../../../../../components/table/table-cells/common/date-cell"
import { Link, Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"
import FaqActions from "../faq.actions/faq.actions"
import { SquareGreenSolid, SquareGreySolid } from "@medusajs/icons"
import { sdk } from "../../../../../lib/client"

export type faqCategoryProps = {
  id: string
  title: string
  handle: string
  created_at: Date
  updated_at: Date
  description: string
  metadata: Record<string, any>
  deleted_at: Date | null
}
export type FaqProps = {
  id: string
  title: string
  content: string
  type: string
  by_admin: boolean
  display_status: "published" | "draft"
  email: string
  customer_name: string
  metadata: Record<string, any>
  category_id: string
  category: faqCategoryProps
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
export const FaqListTable = () => {
  const [faqs, setFaqs] = useState<FaqProps[]>([])
  const LoadFaqData = async () => {
    try {
      const faqResponse = await sdk.admin.faq.listFaqs()
      // const faqResponse = await fetch(`${backendUrl}/admin/faqs`, {
      //   method: "GET",
      //   credentials: "include",
      // })
      // const faqResponseJson = await faqResponse.json()
      setFaqs(faqResponse?.faqs)
    } catch (error: any) {
      console.log(`Failed to fetch faq data : ${error}`)
    }
  }
  useEffect(() => {
    LoadFaqData()
  }, [])

  const { t } = useTranslation()
  return (
    <Container className="divide-y overflow-hidden p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Faqs</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>

      {faqs.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-4 py-12 text-center">
          <h3 className="text-xl font-semibold tracking-tight">
            No FAQs found
          </h3>
          <p className="text-muted-foreground text-sm">
            Get started by creating your first FAQ to help your users.
          </p>
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Sr. No</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>category</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Display Status</Table.HeaderCell>
              <Table.HeaderCell>Customer Name</Table.HeaderCell>
              <Table.HeaderCell>Last Updated</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {faqs
              ?.sort(
                (a: FaqProps, b: FaqProps) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              )
              .map((faq: FaqProps, index) => {
                return (
                  <Table.Row
                    key={faq.id}
                    className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
                  >
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{faq.title}</Table.Cell>
                    <Table.Cell>{faq.type}</Table.Cell>
                    <Table.Cell>{faq.category?.title}</Table.Cell>
                    <Table.Cell>{faq.email}</Table.Cell>
                    <Table.Cell>
                      {faq.display_status === "published" ? (
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
                    </Table.Cell>
                    <Table.Cell>{faq.customer_name ?? "-"}</Table.Cell>
                    <Table.Cell>
                      <DateCell date={faq.updated_at} />
                    </Table.Cell>
                    <Table.Cell>
                      <FaqActions faqId={faq.id} />
                    </Table.Cell>
                  </Table.Row>
                )
              })}
          </Table.Body>
        </Table>
      )}
      <Outlet />
    </Container>
  )
}
