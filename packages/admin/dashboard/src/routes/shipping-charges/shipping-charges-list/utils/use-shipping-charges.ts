import { useState, useEffect, useCallback } from "react"
import { ShippingChargeData } from "../components"
import { deleteShippingCharges, submitShippingCharges, getShippingCharges } from "./shipping-charges"

export const useShippingCharges = () => {
  const [data, setData] = useState<ShippingChargeData[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getShippingCharges()
      if (response && Array.isArray(response) && response.length > 0) {
        setData(response)
        const allColumns = Object.keys(response[0])
        const filteredColumns = allColumns.filter(col =>
          !['created_at', 'updated_at', 'deleted_at', 'id'].includes(col)
        )
        setColumns(filteredColumns)
      } else {
        setData([])
        setColumns([])
      }
    } catch (error) {
      console.error("Error fetching shipping charges:", error)
      setData([])
      setColumns([])
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const submitData = useCallback(async (shippingCharges: ShippingChargeData[]) => {
    setIsLoading(true)
    try {
      await submitShippingCharges(shippingCharges)
      await fetchData()
    } catch (error) {
      console.error("Error submitting shipping charges:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [fetchData])

  const clearData = useCallback(async () => {
    setIsLoading(true)
    try {
      await deleteShippingCharges()
      await fetchData()
    } catch (error) {
      console.error("Error deleting shipping charges:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    columns,
    isLoading,
    hasData: data.length > 0,
    fetchData,
    submitData,
    clearData,
  }
} 