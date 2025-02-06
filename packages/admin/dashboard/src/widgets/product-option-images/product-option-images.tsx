import { Button, clx, Container, Heading } from "@medusajs/ui"
import { useState } from "react"
import EditOptionvalueModal from "./edit-option-modal"
import { AdminProductOption } from "@medusajs/types"

type OptionValue = {
  id: string
  value: string
}

type ProductOptionsProps = {
  options: AdminProductOption[] | null
  handleEditOptionvalue: (value: OptionValue) => void
  optionvalueToEdit?: OptionValue
}

type ProductOptionImagesWidgetProps = {
  data: {
    options: AdminProductOption[] | null
  }
}

const ProductOptions = ({
  options,
  handleEditOptionvalue,
  optionvalueToEdit,
}: ProductOptionsProps) => {
  return (
    <div className="mt-base flex flex-wrap items-center gap-8">
      {options?.map((option) => {
        return (
          <div key={option.id}>
            <Heading level="h3" className="inter-base-semibold mb-xsmall mb-2">
              {option.title}
            </Heading>
            <ul className="flex flex-wrap items-center gap-1">
              {option.values
                ?.filter(
                  (v, index, self) =>
                    self.findIndex((val) => val.value === v.value) === index
                )
                .map((uniqueVal) => (
                  <li key={uniqueVal.id}>
                    <Button
                      variant={
                        optionvalueToEdit &&
                        uniqueVal.id === optionvalueToEdit.id
                          ? "primary"
                          : "transparent"
                      }
                      onClick={() => handleEditOptionvalue(uniqueVal)}
                      className={clx("border-grey-20 px-2.5 py-1", {
                        ["border"]: !(
                          optionvalueToEdit &&
                          uniqueVal.id === optionvalueToEdit.id
                        ),
                      })}
                    >
                      {uniqueVal.value}
                    </Button>
                  </li>
                ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

const ProductOptionImagesWidget = ({
  data,
}: ProductOptionImagesWidgetProps) => {
  const options = data.options
  const [optionvalueToEdit, setOptionvalueToEdit] = useState<
    OptionValue | undefined
  >(undefined)
  const handleEditOptionvalue = (value: OptionValue) => {
    setOptionvalueToEdit(value)
  }
  return (
    <Container className="divide-y p-0 font-sans">
      <Heading level="h2" className="px-6 py-4 font-medium">
        Option Values
      </Heading>
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
    </Container>
  )
}

export default ProductOptionImagesWidget
