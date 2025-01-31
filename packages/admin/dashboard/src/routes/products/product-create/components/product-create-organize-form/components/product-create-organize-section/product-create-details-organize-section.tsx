import { Button, Heading } from "@medusajs/ui"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"

import { ChipGroup } from "../../../../../../../components/common/chip-group"
import { Form } from "../../../../../../../components/common/form"
import { SwitchBox } from "../../../../../../../components/common/switch-box"
import { Combobox } from "../../../../../../../components/inputs/combobox"
import { StackedFocusModal } from "../../../../../../../components/modals"
import { useComboboxData } from "../../../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../../../lib/client"
import { CategoryCombobox } from "../../../../../common/components/category-combobox"
import { ProductCreateSchemaType } from "../../../../types"
import { useEffect, useState } from "react"
import { getSalesChannelIds } from "../../../../../../../const/get-sales-channel"

type ProductCreateOrganizationSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

const fetchBrands = async (salesChannelIds: string[]) => {
  try {
    const queryString = new URLSearchParams()
    salesChannelIds && salesChannelIds[0] && salesChannelIds[0].length != 0
      ? queryString.append("sales_channel", salesChannelIds[0].toString())
      : null
    const response = await sdk.admin.brand.list(queryString)

    const result = response
    return { brands: result.brands }
  } catch (error) {
    console.error(error)
    throw error // Rethrow the error for handling in the component
  }
}

export const ProductCreateOrganizationSection = ({
  form,
}: ProductCreateOrganizationSectionProps) => {
  const { t } = useTranslation()
  const [brands, setBrands] = useState<{ brands: any[] }>({ brands: [] }) // State for brands
  const [loadingBrands, setLoadingBrands] = useState(true) // State for loading brands
  const salesChannelIds = getSalesChannelIds()
  useEffect(() => {
    const fetchBrandsData = async () => {
      try {
        const fetchedBrands = await fetchBrands(salesChannelIds)
        setBrands(fetchedBrands)
      } catch (error) {
        console.error("Failed to fetch brands:", error)
      } finally {
        setLoadingBrands(false) // Set loading to false after fetching
      }
    }

    fetchBrandsData() // Call the fetch function
  }, [])

  const collections = useComboboxData({
    queryKey: ["product_collections"],
    queryFn: (params) =>
      sdk.vendor.productCollection.list({
        ...params,
        ...(salesChannelIds &&
        salesChannelIds[0] &&
        salesChannelIds[0].length != 0
          ? { sales_channel_id: salesChannelIds[0] }
          : {}),
      }),
    getOptions: (data) =>
      data.collections.map((collection) => ({
        label: collection.title!,
        value: collection.id!,
      })),
  })

  const types = useComboboxData({
    queryKey: ["product_types"],
    queryFn: (params) =>
      sdk.vendor.productType.list({
        ...params,
        ...(salesChannelIds &&
        salesChannelIds[0] &&
        salesChannelIds[0].length != 0
          ? { sales_channel_id: salesChannelIds[0] }
          : {}),
      }),
    getOptions: (data) =>
      data.product_types.map((type) => ({
        label: type.value,
        value: type.id,
      })),
  })

  const tags = useComboboxData({
    queryKey: ["product_tags"],
    queryFn: (params) =>
      sdk.vendor.productTag.list({
        ...params,
        ...(salesChannelIds &&
        salesChannelIds[0] &&
        salesChannelIds[0].length != 0
          ? { sales_channel_id: salesChannelIds[0] }
          : {}),
      }),
    getOptions: (data) =>
      data.product_tags.map((tag) => ({
        label: tag.value,
        value: tag.id,
      })),
  })

  const shippingProfiles = useComboboxData({
    queryKey: ["shipping_profiles"],
    queryFn: (params) => sdk.admin.shippingProfile.list(params),
    getOptions: (data) =>
      data.shipping_profiles.map((shippingProfile) => ({
        label: shippingProfile.name,
        value: shippingProfile.id,
      })),
  })

  const { fields, remove, replace } = useFieldArray({
    control: form.control,
    name: "sales_channels",
    keyName: "key",
  })

  const handleClearAllSalesChannels = () => {
    replace([])
  }

  return (
    <div id="organize" className="flex flex-col gap-y-8">
      <Heading>{t("products.organization.header")}</Heading>
      <SwitchBox
        control={form.control}
        name="discountable"
        label={t("products.fields.discountable.label")}
        description={t("products.fields.discountable.hint")}
        optional
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Field
          control={form.control}
          name="type_id"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.type.label")}
                </Form.Label>
                <Form.Control>
                  <Combobox
                    {...field}
                    options={types.options}
                    searchValue={types.searchValue}
                    onSearchValueChange={types.onSearchValueChange}
                    fetchNextPage={types.fetchNextPage}
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={form.control}
          name="collection_id"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.collection.label")}
                </Form.Label>
                <Form.Control>
                  <Combobox
                    {...field}
                    options={collections.options}
                    searchValue={collections.searchValue}
                    onSearchValueChange={collections.onSearchValueChange}
                    fetchNextPage={collections.fetchNextPage}
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Field
          control={form.control}
          name="categories"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.categories.label")}
                </Form.Label>
                <Form.Control>
                  <CategoryCombobox {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={form.control}
          name="tags"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.tags.label")}
                </Form.Label>
                <Form.Control>
                  <Combobox
                    {...field}
                    options={tags.options}
                    searchValue={tags.searchValue}
                    onSearchValueChange={tags.onSearchValueChange}
                    fetchNextPage={tags.fetchNextPage}
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Form.Label>{t("products.fields.shipping_profile.label")}</Form.Label>
          <Form.Hint>
            <Trans i18nKey={"products.fields.shipping_profile.hint"} />
          </Form.Hint>
        </div>
        <Form.Field
          control={form.control}
          name="shipping_profile_id"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Control>
                  <Combobox
                    {...field}
                    options={shippingProfiles.options}
                    searchValue={shippingProfiles.searchValue}
                    onSearchValueChange={shippingProfiles.onSearchValueChange}
                    fetchNextPage={shippingProfiles.fetchNextPage}
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-y-4">
        <Form.Field
          control={form.control}
          name="sales_channels"
          render={() => {
            return (
              <Form.Item>
                <div className="flex items-start justify-between gap-x-4">
                  <div>
                    <Form.Label>
                      {t("products.fields.sales_channels.label")}
                    </Form.Label>
                    <Form.Hint>
                      <Trans i18nKey={"products.fields.sales_channels.hint"} />
                    </Form.Hint>
                  </div>
                  <StackedFocusModal.Trigger asChild>
                    <Button size="small" variant="secondary" type="button">
                      {t("actions.add")}
                    </Button>
                  </StackedFocusModal.Trigger>
                </div>
                <Form.Control className="mt-0">
                  {fields.length > 0 && (
                    <ChipGroup
                      onClearAll={handleClearAllSalesChannels}
                      onRemove={remove}
                      className="py-4"
                    >
                      {fields.map((field, index) => (
                        <ChipGroup.Chip key={field.key} index={index}>
                          {field.name}
                        </ChipGroup.Chip>
                      ))}
                    </ChipGroup>
                  )}
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Field
          control={form.control}
          name="brand_id"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>{"Brand"}</Form.Label>
                <Form.Control>
                  <Combobox
                    {...field}
                    multiple={false}
                    options={brands.brands.map((brand: any) => ({
                      label: brand.name,
                      value: brand.id,
                    }))}
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
    </div>
  )
}
