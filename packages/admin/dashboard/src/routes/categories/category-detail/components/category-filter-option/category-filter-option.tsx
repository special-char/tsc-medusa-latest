"use client"

import { Checkbox, Container, Button, toast, Heading } from "@medusajs/ui"
import { Controller, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProductCategory } from "../../../../../hooks/api"
import { AdminProductCategory } from "@medusajs/types"
import { getVariantsByCategoryHandle } from "../../../../../lib/category-filters"
import { useTranslation } from "react-i18next"
import { Spinner } from "@medusajs/icons"

interface FilterGroup {
  title: string
  values: string[]
}

const CategoryFilterSchema = z.object({
  selected_categories: z.array(z.string()),
})
type CategoryFilterSchemaType = z.infer<typeof CategoryFilterSchema>

export const CategoryFilterOption = ({
  category,
}: {
  category: AdminProductCategory
}) => {
  const { t } = useTranslation()
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<CategoryFilterSchemaType>({
    defaultValues: {
      selected_categories: (category.metadata?.selected_categories ||
        []) as string[],
    },
    resolver: zodResolver(CategoryFilterSchema),
  })

  // // Update form values when filterGroups are loaded to ensure all are initially checked
  // useEffect(() => {
  //   if (filterGroups.length > 0) {
  //     const allTitles = filterGroups.map((group) => group.title)
  //     const currentSelected = form.getValues("selected_categories")

  //     // If no categories are currently selected, select all
  //     if (currentSelected.length === 0) {
  //       form.setValue("selected_categories", allTitles, {
  //         shouldValidate: true,
  //         shouldDirty: false,
  //       })
  //     }
  //   }
  // }, [filterGroups, form])

  const { mutateAsync, isPending } = useUpdateProductCategory(category.id)

  useEffect(() => {
    const fetchCategoryFilters = async () => {
      setLoading(true)
      try {
        const data = await getVariantsByCategoryHandle(category.handle)
        setFilterGroups(Array.isArray(data) ? data : [])
      } catch {
        toast.error("Failed to load category filters")
      } finally {
        setLoading(false)
      }
    }
    fetchCategoryFilters()
  }, [category.handle])

  const handleSubmit = form.handleSubmit(({ selected_categories }) => {
    mutateAsync(
      {
        metadata: {
          ...category.metadata,
          selected_categories,
        },
      },
      {
        onSuccess: () => toast.success(t("categories.edit.successToast")),
        onError: (error) => toast.error(error.message),
      }
    )
  })

  return (
    <Container>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Heading level="h2">Category Filters</Heading>

        {loading ? (
          <Spinner />
        ) : filterGroups.length > 0 ? (
          <Controller
            name="selected_categories"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                {filterGroups.map(({ title }) => {
                  const isChecked = field.value.includes(title)
                  return (
                    <label
                      key={title}
                      className="flex cursor-pointer items-center space-x-3 rounded-lg border p-3"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, title])
                          } else {
                            field.onChange(
                              field.value.filter((v) => v !== title)
                            )
                          }
                        }}
                      />
                      <span className="text-sm">{title}</span>
                    </label>
                  )
                })}
              </div>
            )}
          />
        ) : (
          <p className="py-8 text-center text-sm text-gray-500">
            No categories available for filtering
          </p>
        )}

        <div className="flex justify-end pt-4">
          <Button
            size="small"
            type="submit"
            isLoading={isPending}
            disabled={loading}
          >
            Save
          </Button>
        </div>
      </form>
    </Container>
  )
}
