import { sdk } from "./client"

export const getVariantsByCategoryHandle = async (categoryHandle: string) => {
  try {
    const response = await sdk.admin.categoryFilterOption.retrieve(categoryHandle)
    return response
  } catch (error) {
    console.error("Error retrieving category filter options:", error)
    throw error
  }
} 