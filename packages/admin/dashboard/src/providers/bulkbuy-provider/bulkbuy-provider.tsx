import { PropsWithChildren, useContext, useState } from "react"
import { createContext } from "react"

interface BulkBuyContextType {
  bulkbuyData: any[]
  setBulkBuyData: React.Dispatch<React.SetStateAction<any[]>>
}

const BulkBuyContext = createContext<BulkBuyContextType | undefined>(undefined)

export const BulkBuyProvider = ({ children }: PropsWithChildren) => {
  const [bulkbuyData, setBulkBuyData] = useState<any[]>([])

  const contextValue: BulkBuyContextType = {
    bulkbuyData,
    setBulkBuyData,
  }

  return (
    <BulkBuyContext.Provider value={contextValue}>
      {children}
    </BulkBuyContext.Provider>
  )
}

export const useBulkbuyContext = () => {
  const context = useContext(BulkBuyContext)
  if (context === undefined) {
    throw new Error("useBulkbuyContext must be used within a BulkBuyProvider")
  }
  return context
}
