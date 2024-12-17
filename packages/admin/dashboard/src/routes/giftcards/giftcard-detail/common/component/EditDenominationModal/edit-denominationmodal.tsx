import { Button, toast, Toaster } from "@medusajs/ui"
import {
  useProduct,
  useProductVariant,
  useUpdateProductOption,
  useUpdateProductVariant,
} from "../../../../../../hooks/api/products.tsx"
import { useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useStore } from "../../../../../../hooks/api/index.ts"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

import { RouteFocusModal } from "../../../../../../components/modals/index.ts"
import DenominationForm, {
  DenominationFormType,
} from "../../../../../../components/custom/components/form/DenominationForm.tsx"
import { nestedForm } from "../../../../../../lib/nested-form.ts"

type AddDenominationModalFormType = {
  denominations: DenominationFormType
}

export const EditDenominationModal = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [URLSearchParms] = useSearchParams()
  const searchVariantId = URLSearchParms.get("variant_id")

  const { variant } = useProductVariant(id!, searchVariantId!, undefined)

  const { product } = useProduct(
    variant?.product_id!,
    {
      fields: "-variants",
    },
    {
      enabled: !!variant?.product_id,
    }
  )

  const { mutateAsync } = useUpdateProductOption(
    product?.id || "",
    product?.options?.[0]?.id || ""
  )

  const { mutateAsync: variantUpdateAsync } = useUpdateProductVariant(
    variant?.product_id!,
    variant?.id || ""
  )

  const { store } = useStore()

  const defaultValues: any | undefined = useMemo(() => {
    if (!store) {
      return undefined
    }
    const defaultCurrency = store.supported_currencies.find((c) => c.is_default)

    return {
      denominations: {
        defaultDenomination: {
          amount: variant?.options?.[0].value
            ? (variant?.options?.[0]?.value as any) * 100
            : null,
          currency_code: defaultCurrency ? defaultCurrency.currency_code : null,
        },
        currencyDenominations: store.supported_currencies
          .filter((c) => c.currency_code !== defaultCurrency?.currency_code)
          .map((currency) => {
            const price = variant?.prices?.find(
              (p) => p.currency_code === currency.currency_code
            )

            return {
              currency_code: currency.currency_code,
              amount: price ? price.amount * 100 : null,
            }
          }),
      },
    }
  }, [store, variant])

  const form = useForm<AddDenominationModalFormType>({
    defaultValues,
  })

  useEffect(() => {
    if (variant && store) {
      const defaultCurrency = store.supported_currencies.find(
        (c) => c.is_default
      )
      const newDefaultValues = {
        denominations: {
          defaultDenomination: {
            amount: variant?.options?.[0].value
              ? (variant?.options?.[0]?.value as any) * 100
              : null,
            currency_code: defaultCurrency
              ? defaultCurrency.currency_code
              : null,
          },
          currencyDenominations: store.supported_currencies
            .filter((c) => c.currency_code !== defaultCurrency?.currency_code)
            .map((currency) => {
              const price = variant?.prices?.find(
                (p) => p.currency_code === currency.currency_code
              )
              return {
                currency_code: currency.currency_code,
                amount: price ? price.amount * 100 : null,
              }
            }),
        },
      }
      form.reset(newDefaultValues as any)
    }
  }, [variant, store, form])

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: any) => {
    try {
      const amounts = variant?.options?.map((option) => option.value) || []
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
      // if (optionsData) {
      //   optionsData.values = optionsData?.values.filter(
      //     (value) => !amounts.includes(value)
      //   )
      // }
      const variantsData = {
        options: {},
        prices: [] as Record<string, any>,
      }
      if (data?.denominations?.defaultDenomination) {
        variantsData.options = {
          Denominations: (
            data.denominations.defaultDenomination.amount / 100
          ).toString(),
        }
        variantsData.prices.push({
          amount: data.denominations.defaultDenomination.amount / 100,
          currency_code: data.denominations.defaultDenomination.currency_code,
        })
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
        await variantUpdateAsync({ ...variantsData })
      } else {
        console.log("No options data available for update.")
      }
      navigate(`/gift-cards/${product?.id}`)
      navigate(0)
    } catch (error: any) {
      console.error("Error adding gift card denominations:", error)
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
