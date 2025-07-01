import { useState } from "react"
import EditOptionvalueModal from "../edit-option-modal"
import ProductOptions from "./product-options"
import { AdminProductOption } from "@medusajs/types"

type OptionValue = {
  id: string
  value: string
}

const ProductOptionsSelection = ({
  options,
}: {
  options: AdminProductOption[]
}) => {
  const [optionvalueToEdit, setOptionvalueToEdit] = useState<
    OptionValue | undefined
  >(undefined)

  const handleEditOptionvalue = (value: OptionValue) => {
    setOptionvalueToEdit(value)
  }

  return (
    <>
      <div className="px-6 py-4">
        <ProductOptions
          options={options}
          handleEditOptionvalue={handleEditOptionvalue}
          optionvalueToEdit={optionvalueToEdit}
        />

        {optionvalueToEdit && (
          <EditOptionvalueModal
            optionvalue={optionvalueToEdit}
            options={options}
            onClose={() => setOptionvalueToEdit(undefined)}
          />
        )}
      </div>
    </>
  )
}

export default ProductOptionsSelection
