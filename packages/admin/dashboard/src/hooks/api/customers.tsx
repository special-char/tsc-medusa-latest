import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes, PaginatedResponse } from "@medusajs/types"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { customerGroupsQueryKeys } from "./customer-groups"

const CUSTOMERS_QUERY_KEY = "customers" as const
export const customersQueryKeys = queryKeysFactory(CUSTOMERS_QUERY_KEY)

export const useCustomer = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      { customer: HttpTypes.AdminCustomer },
      FetchError,
      { customer: HttpTypes.AdminCustomer },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: customersQueryKeys.detail(id),
    queryFn: async () => sdk.admin.customer.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCustomers = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<{ customers: HttpTypes.AdminCustomer[] }>,
      FetchError,
      PaginatedResponse<{ customers: HttpTypes.AdminCustomer[] }>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.customer.list(query),
    queryKey: customersQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateCustomer = (
  options?: UseMutationOptions<
    { customer: HttpTypes.AdminCustomer },
    FetchError,
    HttpTypes.AdminCreateCustomer
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.customer.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateCustomer = (
  id: string,
  options?: UseMutationOptions<
    { customer: HttpTypes.AdminCustomer },
    FetchError,
    HttpTypes.AdminUpdateCustomer
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.customer.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteCustomer = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminCustomerDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.customer.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: customersQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useBatchCustomerCustomerGroups = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminCustomerResponse,
    FetchError,
    HttpTypes.AdminBatchLink
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.customer.batchCustomerGroups(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: customersQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: customersQueryKeys.details(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCustomerAddresses = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      { addresses: HttpTypes.AdminCustomerAddressListResponse },
      FetchError,
      { addresses: HttpTypes.AdminCustomerAddressListResponse },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: customersQueryKeys.lists(),
    queryFn: async () => {
      const addresses = await sdk.admin.customer.listAddresses(id)
      return { addresses }
    },
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateCustomerAddress = (
  id: string,
  address_id: string,
  options?: UseMutationOptions<
    { customer: HttpTypes.AdminUpdateCustomerAddress },
    FetchError,
    HttpTypes.AdminUpdateCustomerAddress
  >
) => {
  return useMutation({
    mutationFn: async (payload) => {
      const updatedAddress = await sdk.admin.customer.updateAddress(
        id,
        address_id,
        payload
      )
      return { customer: updatedAddress }
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.list(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
