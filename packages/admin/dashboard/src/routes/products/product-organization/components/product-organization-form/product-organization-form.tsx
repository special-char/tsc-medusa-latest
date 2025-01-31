import { HttpTypes } from "@medusajs/types"
import { Button, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import {
  FormExtensionZone,
  useDashboardExtension,
  useExtendableForm,
} from "../../../../../extensions"
import { useUpdateProduct } from "../../../../../hooks/api/products"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../lib/client"
import { CategoryCombobox } from "../../../common/components/category-combobox"
import { useEffect, useState } from "react"
import { getSalesChannelIds } from "../../../../../const/get-sales-channel"

type ProductOrganizationFormProps = {
  product: HttpTypes.AdminProduct | any
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

const ProductOrganizationSchema = zod.object({
  type_id: zod.string().nullable(),
  collection_id: zod.string().nullable(),
  category_ids: zod.array(zod.string()),
  tag_ids: zod.array(zod.string()),
  brand_id: zod.string().nullable(),
})

export const ProductOrganizationForm = ({
  product,
}: ProductOrganizationFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { getFormConfigs, getFormFields } = useDashboardExtension()
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

  const configs = getFormConfigs("product", "organize")
  const fields = getFormFields("product", "organize")

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
  console.log("🚀 ~ product.categories:", product.categories)

  const form = useExtendableForm({
    defaultValues: {
      type_id: product.type_id ?? "",
      collection_id: product.collection_id ?? "",
      category_ids: product.categories?.map((c) => c.id) || [],
      tag_ids: product.tags?.map((t) => t.id) || [],
      brand_id: product.brand?.id ?? null,
    },
    schema: ProductOrganizationSchema,
    configs: configs,
    data: product,
  })

  const { mutateAsync, isPending } = useUpdateProduct(product.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log("🚀 ~ handleSubmit ~ data:", data)
    console.log("🚀 ~ handleSubmit ~ data.category_ids:", data.category_ids)
    await mutateAsync(
      {
        type_id: data.type_id || null,
        collection_id: data.collection_id || null,
        brand_id: data.brand_id || null,
        categories: data.category_ids.map((c) => ({ id: c })),
        tags: data.tag_ids?.map((t) => ({ id: t })),
        old_brand_id: product.brand?.id,
      },
      {
        onSuccess: ({ product }) => {
          toast.success(
            t("products.organization.edit.toasts.success", {
              title: product.title,
            })
          )
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <div className="flex h-full flex-col gap-y-4">
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
                        multiple={false}
                        options={collections.options}
                        onSearchValueChange={collections.onSearchValueChange}
                        searchValue={collections.searchValue}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="category_ids"
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
              name="tag_ids"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>
                      {t("products.fields.tags.label")}
                    </Form.Label>
                    <Form.Control>
                      <Combobox
                        {...field}
                        multiple
                        options={tags.options}
                        onSearchValueChange={tags.onSearchValueChange}
                        searchValue={tags.searchValue}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
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
            <FormExtensionZone fields={fields} form={form} />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
