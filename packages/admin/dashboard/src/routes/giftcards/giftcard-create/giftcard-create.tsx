import { RouteFocusModal } from "../../../components/modals"
import { useRegions, useStore } from "../../../hooks/api"
import { useMemo } from "react"
import { usePricePreferences } from "../../../hooks/api/price-preferences"
import GiftcardForm from "./giftcard-form"

export const GiftCardCreate = () => {
  const {
    store,
    isPending: isStorePending,
    isError: isStoreError,
    error: storeError,
  } = useStore()

  const {
    regions,
    isPending: isRegionsPending,
    isError: isRegionsError,
    error: regionsError,
  } = useRegions({ limit: 9999 })

  const {
    price_preferences,
    isPending: isPricePreferencesPending,
    isError: isPricePreferencesError,
    error: pricePreferencesError,
  } = usePricePreferences({
    limit: 9999,
  })

  const ready =
    !!store &&
    !isStorePending &&
    !!regions &&
    !isRegionsPending &&
    !!price_preferences &&
    !isPricePreferencesPending

  if (isStoreError) {
    throw storeError
  }

  if (isRegionsError) {
    throw regionsError
  }

  if (isPricePreferencesError) {
    throw pricePreferencesError
  }

  const defaultCurrency = store?.supported_currencies.find((c) => c.is_default)

  const defaultValues: any | undefined = useMemo(() => {
    if (!store) {
      return undefined
    }
    return {
      title: " ",
      description: " ",
      thumbnail: null,
      sales_channels: " ",
      denominations: [
        { amount: null, currency: defaultCurrency?.currency_code },
      ],
    }
  }, [store, defaultCurrency?.currency_code])

  return (
    <RouteFocusModal>
      <RouteFocusModal.Title asChild>
        <span className="sr-only">GiftCard</span>
      </RouteFocusModal.Title>
      <RouteFocusModal.Description asChild>
        <span className="sr-only">GiftCard Create</span>
      </RouteFocusModal.Description>
      <RouteFocusModal.Header />
      {ready && (
        <RouteFocusModal.Body className="flex items-center justify-center overflow-y-scroll pt-8 ">
          <GiftcardForm defaultValues={defaultValues} regions={regions} />
        </RouteFocusModal.Body>
      )}
    </RouteFocusModal>
  )
}
