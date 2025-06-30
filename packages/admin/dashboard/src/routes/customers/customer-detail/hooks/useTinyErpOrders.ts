import { useQuery, QueryKey, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../../../lib/client"

export type TinyErpOrder = {
  id: string
  numero: string
  situacao: string
  data_pedido: string
  total_pedido: string
  url_rastreamento?: string
  cliente_nome?: string
}

export const useTinyErpOrders = (
  email: string | undefined,
  options?: Omit<
    UseQueryOptions<
      { orders: TinyErpOrder[] },
      Error,
      { orders: TinyErpOrder[] },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  return useQuery({
    queryKey: [`tiny-erp-customer-orders-${email}`],
    queryFn: async () => {
      if (!email) {
        console.debug("[TinyERP] No email provided, skipping fetch.")
        return { orders: [] }
      }
      // 1. Get customer info from Tiny ERP by email
      const customerRes: any = await sdk.client.fetch(
        `/admin/tiny-erp-customers?email=${encodeURIComponent(email)}`
      )
      console.debug("[TinyERP] Customer response:", customerRes)
      if (!customerRes) {
        throw new Error("Failed to fetch customer from Tiny ERP")
      }
      const contato = customerRes?.retorno?.contatos?.[0]?.contato
      console.debug("[TinyERP] Extracted contato:", contato)
      const cpfCnpj = contato?.cpf_cnpj
      console.debug("[TinyERP] Extracted cpfCnpj:", cpfCnpj)
      if (!cpfCnpj) {
        return { orders: [] }
      }

      // 2. Get order IDs by cpf_cnpj
      const ordersRes: any = await sdk.client.fetch(
        `/admin/tiny-erp-orders?cpf_cnpj=${encodeURIComponent(cpfCnpj)}`
      )
      console.debug("[TinyERP] Orders response for cpfCnpj:", ordersRes)
      if (!ordersRes) {
        throw new Error("Failed to fetch order IDs from Tiny ERP")
      }
      const pedidos = ordersRes.retorno.pedidos

      const orderIds = pedidos.map((p: any) => p?.pedido?.id).filter(Boolean)
      console.debug("[TinyERP] Extracted orderIds:", orderIds)
      if (!orderIds.length) {
        return { orders: [] }
      }

      // 3. Fetch each order by ID and extract the nested pedido object
      const orderPromises = orderIds.map(async (id: string) => {
        const orderRes: any = await sdk.client.fetch(
          `/admin/tiny-erp-orders/${id}`
        )
        console.debug(`[TinyERP] Order response for id ${id}:`, orderRes)
        return orderRes?.retorno?.pedido || null
      })
      const orders = (await Promise.all(orderPromises)).filter(Boolean)
      console.debug("[TinyERP] All fetched orders:", orders)
      // Map to TinyErpOrder type for the table
      const mappedOrders: TinyErpOrder[] = orders.map((o: any) => ({
        id: o.id,
        numero: o.numero,
        situacao: o.situacao,
        data_pedido: o.data_pedido,
        total_pedido: o.total_pedido,
        url_rastreamento: o.url_rastreamento,
        cliente_nome: o.cliente?.nome,
      }))
      console.debug("[TinyERP] Mapped orders for table:", mappedOrders)
      return { orders: mappedOrders }
    },
    enabled: !!email,
    ...options,
  })
}

export const useTinyErpOrder = (
  orderId: string | undefined,
  options?: Omit<
    UseQueryOptions<any, Error, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  return useQuery({
    queryKey: [`tiny-erp-customer-order-${orderId}`],
    queryFn: async () => {
      if (!orderId) {
        throw new Error("No orderId provided")
      }
      const orderRes: any = await sdk.client.fetch(
        `/admin/tiny-erp-orders/${orderId}`
      )
      if (!orderRes?.retorno?.pedido) {
        throw new Error("Order not found")
      }
      return orderRes
    },
    enabled: !!orderId,
    ...options,
  })
}
