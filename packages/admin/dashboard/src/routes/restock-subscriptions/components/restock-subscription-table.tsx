import {
  Button,
  Container,
  Heading,
  StatusBadge,
  Table,
  toast,
  Checkbox,
} from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { useRestockSubscriptions } from "../hooks/useRestockSubscriptions"
import { useResendRestockNotification } from "../hooks/useResendRestockNotification"
import { useTriggerRestockJob } from "../hooks/useTriggerRestockJob"
import { useRestockSubscriptionTableQuery } from "../hooks/useRestockSubscriptionTableQuery"
import { Thumbnail } from "../../../components/common/thumbnail"
import { useEffect, useState, useMemo } from "react"
import {
  RestockFilterConfig,
  RestockSubscriptionTableFilters,
} from "./restock-subscription-table-filters"

const PAGE_SIZE = 20

export const RestockSubscriptionTable = () => {
  const { t } = useTranslation()
  const [, setSearchParams] = useSearchParams()
  const { searchParams: queryParams } = useRestockSubscriptionTableQuery({
    pageSize: PAGE_SIZE,
  })

  const [searchValue, setSearchValue] = useState<string>(
    (queryParams.q as string) || ""
  )
  const [debouncedSearchValue, setDebouncedSearchValue] =
    useState<string>(searchValue)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchValue])

  useEffect(() => {
    setSearchParams((prev) => {
      const currentQ = prev.get("q") || ""
      const newQ = debouncedSearchValue || ""

      if (currentQ !== newQ) {
        if (newQ) {
          prev.set("q", newQ)
        } else {
          prev.delete("q")
        }
        prev.delete("offset")
      }
      return prev
    })
  }, [debouncedSearchValue, setSearchParams])

  // Filters state
  const [variantFilter, setVariantFilter] = useState<string | undefined>(
    queryParams.variant_id?.[0]
  )
  const [customerFilter, setCustomerFilter] = useState<string | undefined>(
    queryParams.customer_id?.[0]
  )
  const [emailFilter, setEmailFilter] = useState<string | undefined>(
    queryParams.email as string
  )
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    (queryParams.status as unknown as string[])?.[0]
  )

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Sync filters with URL
  useEffect(() => {
    setSearchParams((prev) => {
      let changed = false
      const update = (key: string, val: string | undefined) => {
        const current = prev.get(key)
        if (val && current !== val) {
          prev.set(key, val)
          changed = true
        } else if (!val && current) {
          prev.delete(key)
          changed = true
        }
      }

      update("variant_id", variantFilter)
      update("customer_id", customerFilter)
      update("email", emailFilter)
      update("status", statusFilter)

      if (changed) {
        prev.delete("offset")
      }
      return prev
    })
  }, [
    variantFilter,
    customerFilter,
    emailFilter,
    statusFilter,
    setSearchParams,
  ])

  // Fetch data for filters from restock subscriptions
  const { restock_subscriptions: allSubscriptions } = useRestockSubscriptions({
    fields:
      "product_variant.id,product_variant.title,product_variant.product.title,customer.id,customer.first_name,customer.last_name,customer.email,email,status",
  })

  const variantOptions = useMemo(() => {
    if (!allSubscriptions) {
      return []
    }
    const uniqueVariants = new Map()
    allSubscriptions.forEach((sub: any) => {
      if (sub.product_variant && !uniqueVariants.has(sub.product_variant.id)) {
        uniqueVariants.set(sub.product_variant.id, {
          label: `${sub.product_variant.product?.title} - ${sub.product_variant.title}`,
          value: sub.product_variant.id,
        })
      }
    })
    return Array.from(uniqueVariants.values())
  }, [allSubscriptions])

  const customerOptions = useMemo(() => {
    if (!allSubscriptions) {
      return []
    }
    const uniqueCustomers = new Map()
    allSubscriptions.forEach((sub: any) => {
      if (sub.customer && !uniqueCustomers.has(sub.customer.id)) {
        uniqueCustomers.set(sub.customer.id, {
          label:
            sub.customer.first_name || sub.customer.last_name
              ? `${sub.customer.first_name} ${sub.customer.last_name}`
              : sub.customer.email,
          value: sub.customer.id,
        })
      }
    })
    return Array.from(uniqueCustomers.values())
  }, [allSubscriptions])

  const emailOptions = useMemo(() => {
    if (!allSubscriptions) {
      return []
    }
    const uniqueEmails = new Set()
    allSubscriptions.forEach((sub: any) => {
      if (sub.email) {
        uniqueEmails.add(sub.email)
      }
    })
    return Array.from(uniqueEmails).map((email) => ({
      label: email,
      value: email,
    }))
  }, [allSubscriptions])

  // Fetch selected variant label if filtered
  const selectedVariant = useMemo(() => {
    if (!variantFilter || !allSubscriptions) {
      return undefined
    }
    const sub = allSubscriptions.find(
      (s: any) => s.product_variant?.id === variantFilter
    )
    return sub?.product_variant
  }, [variantFilter, allSubscriptions])

  // Fetch selected customer label if filtered
  const selectedCustomer = useMemo(() => {
    if (!customerFilter || !allSubscriptions) {
      return undefined
    }
    const sub = allSubscriptions.find(
      (s: any) => s.customer?.id === customerFilter
    )
    return sub?.customer
  }, [customerFilter, allSubscriptions])

  const handleFilterChange = (key: string, value: string | undefined) => {
    if (key === "variant_id") {
      setVariantFilter(value)
    }
    if (key === "customer_id") {
      setCustomerFilter(value)
    }
    if (key === "email") {
      setEmailFilter(value)
    }
    if (key === "status") {
      setStatusFilter(value)
    }
  }

  // Selection handlers
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleClearFilters = () => {
    setVariantFilter(undefined)
    setCustomerFilter(undefined)
    setEmailFilter(undefined)
    setStatusFilter(undefined)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "green"
      case "pending":
        return "blue"
      case "failed":
        return "red"
      default:
        return "grey"
    }
  }

  const filters: RestockFilterConfig[] = [
    {
      key: "variant_id",
      label: "Variant",
      searchable: true,
      options: variantOptions.concat(
        selectedVariant &&
          !variantOptions.some((o: any) => o.value === selectedVariant.id)
          ? [
              {
                label: `${selectedVariant.product?.title} - ${selectedVariant.title}`,
                value: selectedVariant.id,
              },
            ]
          : []
      ),
    },
    {
      key: "customer_id",
      label: "Customer",
      searchable: true,
      options: customerOptions.concat(
        selectedCustomer &&
          !customerOptions.some((o: any) => o.value === selectedCustomer.id)
          ? [
              {
                label: `${selectedCustomer.first_name} ${selectedCustomer.last_name}`,
                value: selectedCustomer.id,
              },
            ]
          : []
      ),
    },
    {
      key: "email",
      label: "Email",
      searchable: true,
      options: emailOptions,
    },
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Sent", value: "sent" },
        { label: "Failed", value: "failed" },
      ],
    },
  ]

  const { mutateAsync: triggerJob, isPending: isTriggering } =
    useTriggerRestockJob()

  const { restock_subscriptions, count, isError, error, isLoading } =
    useRestockSubscriptions(
      {
        ...queryParams,
        status: statusFilter ? [statusFilter] : undefined,
        fields: "*product_variant,*product_variant.product,*customer",
      },
      {
        placeholderData: keepPreviousData,
      }
    )

  // Check if all items on current page are selected
  const currentPageIds = restock_subscriptions?.map((sub: any) => sub.id) || []
  const allCurrentPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id: string) => selectedIds.has(id))

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)

      if (allCurrentPageSelected) {
        // Uncheck: Remove only current page items
        currentPageIds.forEach((id: string) => newSet.delete(id))
      } else {
        // Check: Add current page items
        currentPageIds.forEach((id: string) => newSet.add(id))
      }

      return newSet
    })
  }

  const pageIndex = Math.floor((queryParams.offset || 0) / PAGE_SIZE)
  const pageCount = Math.ceil((count || 0) / PAGE_SIZE)
  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < pageCount - 1

  const handleNext = () => {
    if (canNextPage) {
      setSearchParams((prev) => {
        prev.set("offset", String((pageIndex + 1) * PAGE_SIZE))
        return prev
      })
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setSearchParams((prev) => {
        prev.set("offset", String((pageIndex - 1) * PAGE_SIZE))
        return prev
      })
    }
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Restock Subscribers</Heading>
        <div className="flex items-center gap-x-2">
          {selectedIds.size > 0 && (
            <Button
              variant="transparent"
              size="small"
              onClick={() => {
                setSelectedIds(new Set())
                toast.info(`Cleared ${selectedIds.size} selection(s)`)
              }}
            >
              Clear Selection ({selectedIds.size})
            </Button>
          )}
          <Button
            variant="secondary"
            size="small"
            isLoading={isTriggering}
            onClick={async () => {
              try {
                const idsToSend =
                  selectedIds.size > 0 ? Array.from(selectedIds) : undefined

                const result: any = await triggerJob(idsToSend)

                const message = idsToSend
                  ? `Email job started for ${idsToSend.length} selected subscription(s)`
                  : `Email job started for all restocked subscriptions`

                toast.success(result.message || message)
                setSelectedIds(new Set()) // Clear selection after send
              } catch (error: any) {
                toast.error(error.message || "Failed to start restock job")
              }
            }}
          >
            Send Email Reminders
          </Button>
        </div>
      </div>
      <RestockSubscriptionTableFilters
        filters={filters}
        activeFilters={{
          variant_id: variantFilter,
          customer_id: customerFilter,
          email: emailFilter,
          status: statusFilter,
        }}
        onFilterChange={handleFilterChange}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onClearFilters={handleClearFilters}
      />
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Checkbox
                checked={allCurrentPageSelected}
                onCheckedChange={toggleSelectAll}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>{t("fields.email")}</Table.HeaderCell>
            <Table.HeaderCell>{t("fields.status")}</Table.HeaderCell>
            <Table.HeaderCell>{t("fields.product")}</Table.HeaderCell>
            <Table.HeaderCell>Registered User</Table.HeaderCell>
            <Table.HeaderCell>Sign In Date and Time</Table.HeaderCell>
            <Table.HeaderCell>Mail Sent On</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Table.Row key={i}>
                <Table.Cell {...({ colSpan: 8 } as any)}>
                  <div className="bg-ui-bg-subtle h-8 w-full animate-pulse rounded" />
                </Table.Cell>
              </Table.Row>
            ))
          ) : restock_subscriptions && restock_subscriptions.length > 0 ? (
            restock_subscriptions.map((subscription: any, index: number) => (
              <Table.Row key={subscription.id}>
                <Table.Cell>
                  <Checkbox
                    checked={selectedIds.has(subscription.id)}
                    onCheckedChange={() => toggleSelection(subscription.id)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <span className="txt-compact-small text-ui-fg-subtle">
                    {index + 1 + (queryParams.offset || 0)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="truncate">{subscription.email}</span>
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge color={getStatusColor(subscription.status)}>
                    {subscription.status}
                  </StatusBadge>
                </Table.Cell>
                <Table.Cell>
                  <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full max-w-[250px] items-center gap-x-3 overflow-hidden">
                    <div className="w-fit flex-shrink-0">
                      <Thumbnail
                        src={subscription.product_variant?.product?.thumbnail}
                      />
                    </div>
                    <div className="flex flex-col truncate">
                      <span
                        title={subscription.product_variant?.product?.title}
                        className="text-ui-fg-base truncate font-medium"
                      >
                        {subscription.product_variant?.product?.title ?? "N/A"}
                      </span>
                      <span
                        title={subscription.product_variant?.title}
                        className="truncate italic"
                      >
                        {subscription.product_variant?.title}
                      </span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge
                    color={subscription.customer_id ? "green" : "grey"}
                  >
                    {subscription.customer_id ? "Yes" : "No"}
                  </StatusBadge>
                </Table.Cell>
                <Table.Cell>
                  {subscription.customer?.created_at ? (
                    <span className="truncate">
                      {new Date(
                        subscription.customer.created_at
                      ).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-ui-fg-muted">-</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {subscription.sent_at ? (
                    <span className="truncate">
                      {new Date(subscription.sent_at).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-ui-fg-muted">-</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <ActionCell id={subscription.id} />
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell
                {...({ colSpan: 8 } as any)}
                className="text-ui-fg-subtle py-8 text-center"
              >
                No restock subscriptions found
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <Table.Pagination
        count={count || 0}
        pageSize={PAGE_SIZE}
        pageIndex={pageIndex}
        pageCount={pageCount}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        previousPage={handlePrev}
        nextPage={handleNext}
      />
    </Container>
  )
}

const ActionCell = ({ id }: { id: string }) => {
  const { mutateAsync, isPending } = useResendRestockNotification(id)

  const handleResend = async () => {
    try {
      const response = await mutateAsync()
      if (response.result.success) {
        toast.success(response.result.message)
      } else {
        toast.error(response.result.message)
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to resend notification")
    }
  }

  return (
    <div className="flex justify-end">
      <Button
        variant="secondary"
        size="small"
        onClick={handleResend}
        isLoading={isPending}
      >
        Resend
      </Button>
    </div>
  )
}
