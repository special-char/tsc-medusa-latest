import { useParams } from "react-router-dom"
import { useForm, UseFormReturn } from "react-hook-form"
import {
  Button,
  IconButton,
  Input,
  ProgressStatus,
  ProgressTabs,
} from "@medusajs/ui"
import { useState } from "react"
import { Spinner } from "@medusajs/icons"
import { XMark } from "@medusajs/icons"
import { RouteFocusModal } from "../../../../components/modals"
import { KeyboundForm } from "../../../../components/utilities/keybound-form"
import { AmcCreateTab } from "../../constants"
import { Form } from "../../../../components/common/form"

type Props = {
  form: UseFormReturn<any>
  onSubmit: (data: any) => void
  className?: string
}

const AmcRouterModal = (props: Props) => {
  const [tab, setTab] = useState<AmcCreateTab>(AmcCreateTab.AMC_DETAILS)
  type TabState = Record<AmcCreateTab, ProgressStatus>
  const [tabState, setTabState] = useState<TabState>({
    [AmcCreateTab.AMC_DETAILS]: "in-progress",
    [AmcCreateTab.AMC_PRODUCTS]: "not-started",
    [AmcCreateTab.AMC_PRICE]: "not-started",
  })

  const handleTabChange = async (tab: AmcCreateTab) => {
    // Don't do anything if trying to navigate to current tab
    if (tab === AmcCreateTab.AMC_DETAILS) {
      setTab(tab)
      setTabState((prev) => ({
        ...prev,
        [AmcCreateTab.AMC_DETAILS]: "in-progress",
        [AmcCreateTab.AMC_PRODUCTS]: "not-started",
        [AmcCreateTab.AMC_PRICE]: "not-started",
      }))
      return
    }

    // For other tabs, validate required fields
    if (tab === AmcCreateTab.AMC_PRODUCTS) {
      const valid = await props.form.trigger("region_id")
      if (!valid) {
        return
      }

      setTab(tab)
      setTabState((prev) => ({
        ...prev,
        [AmcCreateTab.AMC_DETAILS]: "completed",
        [AmcCreateTab.AMC_PRODUCTS]: "in-progress",
        [AmcCreateTab.AMC_PRICE]: "not-started",
      }))
      return
    }

    if (tab === AmcCreateTab.AMC_PRICE) {
      const valid = await props.form.trigger(["region_id", "variants"])
      if (!valid) {
        return
      }

      setTab(tab)
      setTabState((prev) => ({
        ...prev,
        [AmcCreateTab.AMC_DETAILS]: "completed",
        [AmcCreateTab.AMC_PRODUCTS]: "completed",
        [AmcCreateTab.AMC_PRICE]: "in-progress",
      }))
      return
    }
  }
  return (
    <RouteFocusModal.Form form={props.form}>
      <KeyboundForm
        className="flex h-full flex-col"
        onSubmit={props.form.handleSubmit(props.onSubmit)}
      >
        <ProgressTabs
          value={tab}
          onValueChange={() => {}}
          className="flex h-full flex-col overflow-hidden"
        >
          <RouteFocusModal.Header>
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="-my-2 w-full max-w-[600px] border-l">
                <ProgressTabs.List className="grid w-full grid-cols-4">
                  <ProgressTabs.Trigger
                    className="w-full"
                    value={AmcCreateTab.AMC_DETAILS}
                    status={tabState[AmcCreateTab.AMC_DETAILS]}
                    onClick={() => handleTabChange(AmcCreateTab.AMC_DETAILS)}
                  >
                    AMC Details
                  </ProgressTabs.Trigger>

                  <ProgressTabs.Trigger
                    className="w-full"
                    value={AmcCreateTab.AMC_PRODUCTS}
                    status={tabState[AmcCreateTab.AMC_PRODUCTS]}
                    onClick={() => handleTabChange(AmcCreateTab.AMC_PRODUCTS)}
                  >
                    AMC Products
                  </ProgressTabs.Trigger>
                  <ProgressTabs.Trigger
                    className="w-full"
                    value={AmcCreateTab.AMC_PRICE}
                    status={tabState[AmcCreateTab.AMC_PRICE]}
                    onClick={() => handleTabChange(AmcCreateTab.AMC_PRICE)}
                  >
                    AMC Price
                  </ProgressTabs.Trigger>
                </ProgressTabs.List>
              </div>
            </div>
          </RouteFocusModal.Header>

          <RouteFocusModal.Body className="size-full overflow-hidden">
            <ProgressTabs.Content
              value={AmcCreateTab.AMC_DETAILS}
              className="flex flex-col items-center overflow-y-auto"
            >
              <div className="flex size-full max-w-3xl flex-col gap-4 p-16">
                <Form.Field
                  control={props.form.control}
                  name="title"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>Title</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Form.Field
                    control={props.form.control}
                    name="sku"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>SKU</Form.Label>
                          <Form.Control>
                            <Input autoComplete="off" {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={props.form.control}
                    name="barcode"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>Barcode</Form.Label>
                          <Form.Control>
                            <Input autoComplete="off" {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              </div>
            </ProgressTabs.Content>

            <ProgressTabs.Content
              value={AmcCreateTab.AMC_PRODUCTS}
              className="size-full overflow-y-auto"
            >
              <Form.Field
                control={props.form.control}
                name="variants"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col">
                    <input
                      type="hidden"
                      {...field}
                      value={JSON.stringify(field.value)}
                    />
                    {/* <_DataTable
                  table={productTable}
                  columns={variantColumns}
                  pageSize={VARIANT_PAGE_SIZE}
                  count={variantCount}
                  queryObject={variantRaw}
                  orderBy={[
                    { key: "title", label: t("fields.title") },
                    { key: "created_at", label: t("fields.createdAt") },
                    { key: "updated_at", label: t("fields.updatedAt") },
                  ]}
                  prefix={VARIANT_PREFIX}
                  layout="fill"
                  pagination
                  search="autofocus"
                /> */}
                    {fieldState.error && (
                      <p className="px-4 text-sm text-red-700">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </ProgressTabs.Content>

            <ProgressTabs.Content
              value={AmcCreateTab.AMC_PRICE}
              className="relative flex size-full flex-col items-center overflow-auto"
            >
              <div className="flex size-full max-w-3xl flex-col gap-4 p-16">
                <Form.Field
                  control={props.form.control}
                  name="customer_id"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>Choose Existing Customer</Form.Label>
                        <Form.Control>
                          <div className="relative">
                            {/* <Combobox
                          {...field}
                          options={customers.options}
                          onSearchValueChange={
                            customers.onSearchValueChange
                          }
                          searchValue={customers.searchValue}
                          fetchNextPage={customers.fetchNextPage}
                          onChange={(value) => {
                            field.onChange(value)
                            setSelectedCustomerId(value || "")
                          }}
                        /> */}
                            {field.value && (
                              <IconButton
                                type="button"
                                variant="transparent"
                                className="absolute right-10 top-1/2 -translate-y-1/2 rounded-none"
                              >
                                <XMark />
                              </IconButton>
                            )}
                          </div>
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={props.form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>Email</Form.Label>
                        <Form.Control>
                          <Input
                            autoComplete="off"
                            {...field}
                            disabled={!!props.form.watch("customer_id")}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Form.Field
                    control={props.form.control}
                    name="first_name"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>First Name</Form.Label>
                          <Form.Control>
                            <Input autoComplete="off" {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={props.form.control}
                    name="last_name"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control>
                            <Input autoComplete="off" {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={props.form.control}
                    name="company_name"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>Company</Form.Label>
                          <Form.Control>
                            <Input autoComplete="off" {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={props.form.control}
                    name="phone"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>Phone</Form.Label>
                          <Form.Control>
                            <Input autoComplete="off" {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              </div>
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </ProgressTabs>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                Cancel
              </Button>
            </RouteFocusModal.Close>

            <Button key="continue-btn" type="button" size="small">
              {tab === AmcCreateTab.AMC_PRICE ? (
                props.form.formState.isSubmitting ? (
                  <Spinner className="animate-spin" />
                ) : (
                  "Create Order"
                )
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

export default AmcRouterModal
