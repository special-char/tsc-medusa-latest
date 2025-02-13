import { Button, Container, Heading, Input, Label, Prompt } from "@medusajs/ui"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import CustomTable from "../../../components/common/CustomTable"
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { sdk } from "../../../lib/client"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { useForm } from "react-hook-form"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"

const listVendors = async () => {
  const response = await sdk.vendor.retrieve()
  return response
}

export function VendorList() {
  const [vendorList, setVendorList] = useState([])

  const navigate = useNavigate()
  const location = useLocation()
  const PAGE_SIZE = 10

  const columnHelper = createColumnHelper<any>()

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("handle", {
      header: "Handle",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      header: "Action",
      id: "action",
      cell: (info) => {
        return (
          <div className="flex w-[100px] gap-5">
            <Prompt>
              <Prompt.Trigger asChild>
                <Button variant="secondary">View QR</Button>
              </Prompt.Trigger>
              <Prompt.Content className="">
                <Prompt.Header>
                  <Prompt.Title>Scan QR</Prompt.Title>
                  <Prompt.Description>
                    Scan this QR to redeem your gift card.
                  </Prompt.Description>
                  <Prompt.Footer className="flex flex-col gap-4">
                    <QRCode
                      className="bg-white p-5"
                      value={info.row.original.id}
                      size={200}
                    />
                    <Prompt.Cancel className="self-end">Cancel</Prompt.Cancel>
                  </Prompt.Footer>
                </Prompt.Header>
              </Prompt.Content>
            </Prompt>
          </div>
        )
      },
    }),
    columnHelper.display({
      header: "Remote Redemotion",
      id: "remote_redemotion",
      cell: (info) => {
        const form = useForm()

        const [redemption, setRedemption] = useState()

        const [open, setOpen] = useState(false)

        const clearForm = () => {
          setOpen(false)
          setRedemption()
          form.reset({
            code: "",
            amount: "",
          })
        }
        const onSubmit = async (data) => {
          if (
            !redemption?.balance ||
            redemption?.balance === undefined ||
            redemption?.balance === null
          ) {
            try {
              const { redemptions } = await sdk.admin.redemption.retrieveAll(
                data.code,
                info.row.original.id
              )
              console.log("redemptions::::", redemptions)

              if (redemptions?.length > 0) {
                const redemptionData = redemptions?.[0]
                if (redemptionData.balance <= 0) {
                  form.setError("code", {
                    message: `Redemption code is already used ${redemptionData.balance} balance left`,
                  })
                } else {
                  setRedemption(redemptionData)
                }
              } else {
                form.setError("code", {
                  message: `The redemption code you entered is not valid. Please check and try again.`,
                })
              }
            } catch (error: any) {
              console.log("error:::", error.message)
              form.setError("code", {
                message: error.message || "Invalid code",
              })
            }
          }
          if (data.amount < 150) {
            form.setError("amount", {
              message: `Amount should be grater than or equal to 150`,
            })
            return
          }
          if ((redemption?.balance as number) && (redemption?.id as string)) {
            if (data.amount > redemption?.balance) {
              form.setError("amount", {
                message: `Amount should be less than or equal to ${redemption.balance}`,
              })
              return
            }
            await sdk.admin.redemption.addHistory({
              vendor_id: info.row.original.id,
              amount_spent: Number(data.amount),
              where_deducted: "Remote",
              redemption_id: redemption?.id as string,
            })
            clearForm()
          }
        }

        return (
          <div className="flex w-[100px] gap-5">
            <Prompt open={open}>
              <Prompt.Trigger asChild>
                <Button variant="secondary" onClick={() => setOpen(true)}>
                  Redeem
                </Button>
              </Prompt.Trigger>
              <Prompt.Content className="">
                <Prompt.Header>
                  <Prompt.Title>
                    Remote Redemption for {info.row.original.name}
                  </Prompt.Title>
                  <Prompt.Description>
                    Enter the code to redeem a gift card.
                  </Prompt.Description>
                  <DynamicForm
                    isPending={form.formState.isSubmitting}
                    form={form}
                    btnTitle={
                      (redemption?.balance as number) ? "Submit" : "Verify"
                    }
                    schema={{
                      code: {
                        label: "Code",
                        props: {
                          placeholder: "XXXX-XXXX-XXXX-XXXX",
                          disabled: redemption?.balance ? true : false,
                        },
                        fieldType: "input",
                        validation: {
                          required: {
                            value: true,
                            message: "Code is required field",
                          },
                        },
                      },
                      ...(redemption?.balance && {
                        amount: {
                          label: `Amount (Balance Left ${redemption?.balance})`,
                          fieldType: "input",
                          props: {
                            placeholder: "300 (min: 150)",
                            type: "number",
                          },
                          validation: {
                            required: {
                              value: true,
                              message: "Amount is required field",
                            },
                          },
                        },
                      }),
                    }}
                    onSubmit={form.handleSubmit(onSubmit)}
                  />
                  {/* <Form className="flex flex-col gap-4">
                    <div>
                      <Label>Code</Label>
                      <Input />
                    </div>
                    <div>
                      <Label>Redemption Amount</Label>
                      <Input />
                    </div>
                    </Form> */}
                  {/* <Button variant="primary">Verify</Button> */}
                  <Prompt.Footer className="flex flex-col gap-4">
                    <Prompt.Cancel
                      onClick={() => clearForm()}
                      className="self-end"
                    >
                      Cancel
                    </Prompt.Cancel>
                  </Prompt.Footer>
                </Prompt.Header>
              </Prompt.Content>
            </Prompt>
          </div>
        )
      },
    }),
  ]

  const table = useReactTable<any>({
    data: vendorList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect(() => {
    listVendors().then((res) => {
      setVendorList(res.data)
    })
  }, [location])

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Heading>Merchant list</Heading>
        <Button
          variant="primary"
          onClick={() => {
            navigate(`/merchants/create`)
          }}
        >
          Create
        </Button>
      </div>
      <div className="my-4">
        <CustomTable PAGE_SIZE={PAGE_SIZE} data={vendorList} table={table} />
      </div>
      <Outlet />
    </Container>
  )
}
