/* eslint-disable prettier/prettier */
import {
  Button,
  Checkbox,
  IconButton,
  Input,
  ProgressStatus,
  ProgressTabs,
  toast,
} from "@medusajs/ui"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useForm } from "react-hook-form"
import { useEffect, useMemo, useState } from "react"
import { OrderCreateTab } from "./constants"
import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../lib/client"
import { _DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useCustomer, useVariants } from "../../../../../hooks/api"
import { useTranslation } from "react-i18next"
import {
  createColumnHelper,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table"
import * as zod from "zod"
import { AdminRegion, HttpTypes } from "@medusajs/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProductHeader } from "../../../../../components/table/table-cells/product/product-cell"
import { useVariantTableQuery } from "../../../../../hooks/table/query/use-variant-table-query"
import { Spinner, XMark } from "@medusajs/icons"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { useQuery } from "@tanstack/react-query"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"

const OrderCreateSchema = zod.object({
  region_id: zod.string().min(1, "Region is required"),
  variants: zod
    .array(
      zod.object({
        id: zod.string(),
        quantity: zod.number().min(1),
        variant: zod.any(),
      })
    )
    .min(1, "At least one variant is required"),
  customer_id: zod.string().optional(),
  email: zod
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  first_name: zod.string().min(2, "First name is required"),
  last_name: zod.string().min(2, "Last name is required"),
  company_name: zod.string().optional(),
  phone: zod.string().optional(),
  // promotions: zod.array(zod.string().optional()).optional(),
  promotions: zod.string().optional(),
})

type SelectedVariant = {
  id: string
  quantity: number
  variant: HttpTypes.StoreProductVariant
}

type OrderCreateFormProps = {
  region_id: string
  variants: SelectedVariant[]
  customer_id?: string
  email?: string
  first_name?: string
  last_name?: string
  company_name?: string
  phone?: string
  promotions?: string
}

export const OrderCreateForm = () => {
  const { handleSuccess } = useRouteModal()
  const form = useForm<OrderCreateFormProps>({
    resolver: zodResolver(OrderCreateSchema),
    defaultValues: {
      region_id: "",
      variants: [],
      customer_id: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      company_name: "",
      promotions: "",
    },
    mode: "onChange",
  })

  const regionId = form.watch("region_id")

  const { data: region, isLoading: isRegionLoading } = useQuery({
    queryKey: ["region", regionId],
    queryFn: async () => {
      if (!regionId) {
        return null
      }
      return await sdk.admin.region.retrieve(regionId)
    },
    enabled: !!regionId,
  })

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  )
  const { customer } = useCustomer(selectedCustomerId || "")
  type TabState = Record<OrderCreateTab, ProgressStatus>
  const [tab, setTab] = useState<OrderCreateTab>(OrderCreateTab.REGION)
  const [tabState, setTabState] = useState<TabState>({
    [OrderCreateTab.REGION]: "in-progress",
    [OrderCreateTab.PRODUCTS]: "not-started",
    [OrderCreateTab.CUSTOMER]: "not-started",
  })
  const { t } = useTranslation()
  const regions = useComboboxData({
    queryKey: ["region", "create-order"],
    queryFn: (params) => sdk.admin.region.list(params),
    getOptions: (data) =>
      data.regions.map((region) => ({
        label: region.name,
        value: region.id,
      })),
  })

  const customers = useComboboxData({
    queryKey: ["customer", "create-order"],
    queryFn: (params) => sdk.admin.customer.list(params),
    getOptions: (data) =>
      data.customers.map((customer) => ({
        label: `${customer.email} (${customer.has_account === false ? "Guest" : "Registered"})`,
        value: customer.id,
      })),
  })

  const promotions = useComboboxData({
    queryKey: ["promotions", "create-order"],
    queryFn: (params) => sdk.admin.promotion.list(params),
    getOptions: (data) =>
      data.promotions.map((promotion) => ({
        label: promotion.code!,
        value: promotion.code!,
      })),
  })

  useEffect(() => {
    if (customer) {
      form.setValue("email", customer.email)
      form.setValue("first_name", customer.first_name || "")
      form.setValue("last_name", customer.last_name || "")
      form.setValue("phone", customer.phone || "")
      form.setValue("company_name", customer.company_name || "")
    }
  }, [customer, form])
  const VARIANT_PAGE_SIZE = 10
  const VARIANT_PREFIX = "variant"
  const { searchParams: variantSearchParams, raw: variantRaw } =
    useVariantTableQuery({
      pageSize: VARIANT_PAGE_SIZE,
      prefix: VARIANT_PREFIX,
    })

  const variantColumns = useVariantColumns({ region: region?.region })

  const { variants = [], count: variantCount } = useVariants({
    ...variantSearchParams,
  })

  const variantsData = variants || []

  const [variantSelection, setVariantSelection] = useState<RowSelectionState>(
    () =>
      (variantsData ?? []).reduce((acc: any, p: any) => {
        acc[p.id!] = false
        return acc
      }, {} as RowSelectionState)
  )

  const variantUpdater: OnChangeFn<RowSelectionState> = (newSelection) => {
    const value =
      typeof newSelection === "function"
        ? newSelection(variantSelection)
        : newSelection

    const selectedVariants = Object.entries(value)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => {
        const variant = variantsData.find((v: any) => v.id === id)
        return {
          id,
          quantity: 1,
          variant: variant,
        }
      })

    form.setValue("variants", selectedVariants, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })

    setVariantSelection(value)
  }
  const { table: productTable } = useDataTable({
    data: variantsData,
    columns: variantColumns,
    getRowId: (original) => original.id,
    count: variantCount,
    pageSize: VARIANT_PAGE_SIZE,
    prefix: VARIANT_PREFIX,
    enableRowSelection: (row) => {
      return !variantSelection[row.original.id]
    },
    enablePagination: true,
    rowSelection: {
      state: variantSelection,
      updater: variantUpdater,
    },
  })

  const handleTabChange = async (tab: OrderCreateTab) => {
    // Don't do anything if trying to navigate to current tab
    if (tab === OrderCreateTab.REGION) {
      setTab(tab)
      setTabState((prev) => ({
        ...prev,
        [OrderCreateTab.REGION]: "in-progress",
        [OrderCreateTab.PRODUCTS]: "not-started",
        [OrderCreateTab.CUSTOMER]: "not-started",
      }))
      return
    }

    // For other tabs, validate required fields
    if (tab === OrderCreateTab.PRODUCTS) {
      const valid = await form.trigger("region_id")
      if (!valid) {
        return
      }

      setTab(tab)
      setTabState((prev) => ({
        ...prev,
        [OrderCreateTab.REGION]: "completed",
        [OrderCreateTab.PRODUCTS]: "in-progress",
        [OrderCreateTab.CUSTOMER]: "not-started",
      }))
      return
    }

    if (tab === OrderCreateTab.CUSTOMER) {
      const valid = await form.trigger(["region_id", "variants"])
      if (!valid) {
        return
      }

      setTab(tab)
      setTabState((prev) => ({
        ...prev,
        [OrderCreateTab.REGION]: "completed",
        [OrderCreateTab.PRODUCTS]: "completed",
        [OrderCreateTab.CUSTOMER]: "in-progress",
      }))
      return
    }
  }

  const handleContinue = async () => {
    switch (tab) {
      case OrderCreateTab.REGION: {
        // Validate region before continuing
        const valid = await form.trigger("region_id")
        if (valid) {
          handleTabChange(OrderCreateTab.PRODUCTS)
        }
        break
      }
      case OrderCreateTab.PRODUCTS: {
        // Validate both region and products before continuing
        const valid = await form.trigger(["region_id", "variants"])
        if (valid) {
          handleTabChange(OrderCreateTab.CUSTOMER)
        }
        break
      }
      case OrderCreateTab.CUSTOMER:
        // Submit form when clicking continue on last tab
        await form.handleSubmit(onSubmit)()
        break
    }
  }

  const onSubmit = async (data: OrderCreateFormProps) => {
    try {
      if (!data?.region_id) {
        toast.error("Region Id is required")
      }
      const user = {
        customer_id: data?.customer_id || "",
        email: data?.email || "",
        first_name: data?.first_name || "",
        last_name: data?.last_name || "",
        company_name: data?.company_name || "",
        phone: data?.phone || "",
      }

      const items = data?.variants?.map((item) => ({
        variant_id: item?.id,
        quantity: item?.quantity,
        product_id: item?.variant?.product?.id,
      }))

      const orderData = {
        region_id: data?.region_id,
        items,
        user,
        promotionCodes: data?.promotions ? [data?.promotions] : [],
      }

      console.log("orderData", orderData)
      const order = await sdk.admin.createOrder.create({ ...orderData })
      if (order) {
        toast.success("Order placed successfully")
        handleSuccess(`/orders/${order.id}`)
      }
    } catch (error: any) {
      console.error("Error Creating Order", error.message)
      toast.error(`Failed to create order : ${error.message}`)
    }
  }

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        className="flex h-full flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
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
                    value={OrderCreateTab.REGION}
                    status={tabState[OrderCreateTab.REGION]}
                    onClick={() => handleTabChange(OrderCreateTab.REGION)}
                  >
                    Region
                  </ProgressTabs.Trigger>

                  <ProgressTabs.Trigger
                    className="w-full"
                    value={OrderCreateTab.PRODUCTS}
                    status={tabState[OrderCreateTab.PRODUCTS]}
                    onClick={() => handleTabChange(OrderCreateTab.PRODUCTS)}
                  >
                    Products
                  </ProgressTabs.Trigger>
                  <ProgressTabs.Trigger
                    className="w-full"
                    value={OrderCreateTab.CUSTOMER}
                    status={tabState[OrderCreateTab.CUSTOMER]}
                    onClick={() => handleTabChange(OrderCreateTab.CUSTOMER)}
                  >
                    Customer
                  </ProgressTabs.Trigger>
                </ProgressTabs.List>
              </div>
            </div>
          </RouteFocusModal.Header>

          <RouteFocusModal.Body className="size-full overflow-hidden">
            <ProgressTabs.Content
              value={OrderCreateTab.REGION}
              className="flex flex-col items-center overflow-y-auto"
            >
              <div className="flex size-full max-w-3xl flex-col p-16">
                <Form.Field
                  control={form.control}
                  name="region_id"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>Region</Form.Label>
                        <Form.Control>
                          <Combobox
                            {...field}
                            options={regions.options}
                            onSearchValueChange={regions.onSearchValueChange}
                            searchValue={regions.searchValue}
                            fetchNextPage={regions.fetchNextPage}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
            </ProgressTabs.Content>

            <ProgressTabs.Content
              value={OrderCreateTab.PRODUCTS}
              className="size-full overflow-y-auto"
            >
              <Form.Field
                control={form.control}
                name="variants"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col">
                    <input
                      type="hidden"
                      {...field}
                      value={JSON.stringify(field.value)}
                    />
                    <_DataTable
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
                    />
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
              value={OrderCreateTab.CUSTOMER}
              className="relative flex size-full flex-col items-center overflow-auto"
            >
              <div className="flex size-full max-w-3xl flex-col gap-4 p-16">
                <Form.Field
                  control={form.control}
                  name="customer_id"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>Choose Existing Customer</Form.Label>
                        <Form.Control>
                          <div className="relative">
                            <Combobox
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
                            />
                            {field.value && (
                              <IconButton
                                type="button"
                                variant="transparent"
                                className="absolute right-10 top-1/2 -translate-y-1/2 rounded-none"
                                onClick={() => {
                                  field.onChange("")
                                  setSelectedCustomerId(null)
                                  form.reset({
                                    ...form.getValues(),
                                    customer_id: "",
                                    email: "",
                                    first_name: "",
                                    last_name: "",
                                    phone: "",
                                    company_name: "",
                                  })
                                }}
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
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.email")}</Form.Label>
                        <Form.Control>
                          <Input
                            autoComplete="off"
                            {...field}
                            disabled={!!form.watch("customer_id")}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Form.Field
                    control={form.control}
                    name="first_name"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t("fields.firstName")}</Form.Label>
                          <Form.Control>
                            <Input autoComplete="off" {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="last_name"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t("fields.lastName")}</Form.Label>
                          <Form.Control>
                            <Input autoComplete="off" {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="company_name"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>
                            {t("fields.company")}
                          </Form.Label>
                          <Form.Control>
                            <Input autoComplete="off" {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="phone"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label optional>{t("fields.phone")}</Form.Label>
                          <Form.Control>
                            <Input autoComplete="off" {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
                <Form.Field
                  control={form.control}
                  name="promotions"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>Select Promotion Code</Form.Label>
                        <Form.Control>
                          <Combobox
                            {...field}
                            // multiple={true}
                            options={promotions.options}
                            onSearchValueChange={promotions.onSearchValueChange}
                            searchValue={promotions.searchValue}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
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

            <Button
              key="continue-btn"
              type="button"
              onClick={handleContinue}
              size="small"
            >
              {tab === OrderCreateTab.CUSTOMER ? (
                form.formState.isSubmitting ? (
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

const variantColumnHelper = createColumnHelper<HttpTypes.AdminProductVariant>()

const useVariantColumns = ({ region }: { region: AdminRegion | undefined }) => {
  const { t } = useTranslation()
  return useMemo(
    () => [
      variantColumnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllRowsSelected()
                ? true
                : table.getIsSomeRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      }),
      variantColumnHelper.display({
        id: "variant",
        header: () => (
          <div className="flex h-full w-full items-center">
            <span>Variant</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex h-full w-full max-w-[250px] items-center gap-x-3 overflow-hidden">
            <div className="w-fit flex-shrink-0">
              <Thumbnail src={row.original.product?.thumbnail} />
            </div>
            <span title={row.original?.title || ""} className="truncate">
              {row.original?.title}
            </span>
          </div>
        ),
      }),
      variantColumnHelper.display({
        id: "product",
        header: () => <ProductHeader />,
        cell: ({ row }) => (
          <div className="text-sm text-gray-500">
            {row.original.product?.title}
          </div>
        ),
      }),

      variantColumnHelper.accessor("prices", {
        header: () => <span>{t("fields.price")}</span>,
        cell: ({ row }) => {
          const defaultPrice = row.original.prices?.find(
            (p: any) => p.currency_code === (region?.currency_code || "")
          )

          if (!defaultPrice?.amount || !region?.currency_code) {
            return "-"
          }
          const formatted = getStylizedAmount(
            defaultPrice?.amount,
            region?.currency_code
          )

          return <div>{formatted}</div>
        },
      }),
    ],
    [t, region]
  )
}
