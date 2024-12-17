import { Button, toast, Toaster } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import {
  useCreateProductVariant,
  useProduct,
  useProductVariants,
  useUpdateProductOption,
} from "../../../../../../hooks/api/products.tsx"
import { useProductVariantTableQuery } from "../../../../../products/product-detail/components/product-variant-section/use-variant-table-query.tsx"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useStore } from "../../../../../../hooks/api/index.ts"
import { useNavigate, useParams } from "react-router-dom"

import { PRODUCT_DETAIL_FIELDS } from "../../../../../products/product-detail/constants.ts"
import { RouteFocusModal } from "../../../../../../components/modals/index.ts"
import { nestedForm } from "../../../../../../lib/nested-form.ts"
import DenominationForm, {
  DenominationFormType,
} from "../../../../../../components/custom/components/form/DenominationForm.tsx"

type AddDenominationModalFormType = {
  denominations: DenominationFormType
}

const PAGE_SIZE = 10

export const AddDenominationModal = () => {
  const { id } = useParams()

  const { product } = useProduct(id!, {
    fields: PRODUCT_DETAIL_FIELDS,
  })

  const navigate = useNavigate()

  const { mutateAsync } = useUpdateProductOption(
    product?.id || "",
    product?.options?.[0]?.id || ""
  )

  const { mutateAsync: variantAsync } = useCreateProductVariant(
    product?.id || ""
  )

  const { searchParams } = useProductVariantTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { variants, isError, error } = useProductVariants(
    product?.id || "",
    {
      ...searchParams,
      fields: "*inventory_items.inventory.location_levels,+inventory_quantity",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  if (isError) {
    throw error
  }

  const { store } = useStore()

  const defaultValues: any | undefined = useMemo(() => {
    if (!store) {
      return undefined
    }
    const defaultCurrency = store.supported_currencies.find((c) => c.is_default)

    return {
      denominations: {
        defaultDenomination: {
          currency_code: defaultCurrency ? defaultCurrency.currency_code : null,
        },
        currencyDenominations: store.supported_currencies
          .filter((c) => c.currency_code !== defaultCurrency?.currency_code)
          .map((currency) => {
            return {
              currency_code: currency.currency_code,
            }
          }),
      },
    }
  }, [store])

  const form = useForm<AddDenominationModalFormType>({
    defaultValues,
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: any) => {
    try {
      const optionsData = product?.options?.reduce(
        (p, c) => {
          const amounts = c?.values?.map((valueObj) => valueObj.value) || []
          p.title = c.title
          p.values = [
            ...(p.values || []),
            ...amounts,
            ...(data.denominations.defaultDenomination.amount
              ? [
                  (
                    data.denominations.defaultDenomination.amount / 100
                  ).toString(),
                ]
              : []),
          ]
          return p
        },
        { title: "", values: [] } as { title: string; values: string[] }
      )
      const variantsData = {
        title: "",
        prices: [] as Record<string, any>,
        options: {},
        allow_backorder: false,
        manage_inventory: false,
      }

      if (data?.denominations?.defaultDenomination) {
        variantsData.title = `${variants.length + 1}`
        variantsData.options = {
          Denominations: (
            data.denominations.defaultDenomination.amount / 100
          ).toString(),
        }
        variantsData.prices.push({
          amount: data.denominations.defaultDenomination.amount / 100,
          currency_code: data.denominations.defaultDenomination.currency_code,
        })
        variantsData.allow_backorder = true
        variantsData.manage_inventory = false
      }

      data.denominations.currencyDenominations.forEach((c: any) => {
        if (
          (c.amount !== null && c.amount !== undefined) ||
          data.denominations.useSameValue
        ) {
          variantsData.prices.push({
            amount: data.denominations.useSameValue
              ? data.denominations.defaultDenomination.amount / 100
              : c.amount / 100,
            currency_code: c.currency_code,
          })
        }
      })

      if (product?.id && product?.options?.[0]?.id && optionsData) {
        await mutateAsync({
          id: product?.options?.[0]?.id,
          ...optionsData,
        })
        await variantAsync({ ...variantsData })
      } else {
        console.log("No options data available for update.")
      }
      navigate(`/gift-cards/${product?.id}`)
      navigate(0)
    } catch (error: any) {
      console.error("Error adding gift card denominations:", error.message)
      toast.error("Error", {
        description: `${error.message}`,
        duration: 5000,
      })
    }
  }

  return (
    <RouteFocusModal>
      <Toaster />
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="flex items-center justify-center overflow-y-scroll pt-8 ">
        <div className="flex flex-col gap-y-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DenominationForm form={nestedForm(form, "denominations")} />
            <div className="flex w-full items-center justify-end p-4 my-4">
              <Button
                variant="primary"
                size="large"
                type="submit"
                isLoading={isSubmitting}
              >
                Save and close
              </Button>
            </div>
          </form>
        </div>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
