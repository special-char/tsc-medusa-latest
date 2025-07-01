import { AdminProductOption } from "@medusajs/types"
import { Button, clx, Heading } from "@medusajs/ui"

type OptionValue = {
  id: string
  value: string
}

type ProductOptionsProps = {
  options: AdminProductOption[] | null
  handleEditOptionvalue: (value: OptionValue) => void
  optionvalueToEdit?: OptionValue
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

export default ProductOptions
