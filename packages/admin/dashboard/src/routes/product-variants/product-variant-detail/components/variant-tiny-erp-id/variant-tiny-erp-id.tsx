import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, Input, Label, toast } from "@medusajs/ui"
import { LockClosedSolid, LockOpenSolid } from "@medusajs/icons"
import { useTranslation } from "react-i18next"

import { Controller, useForm } from "react-hook-form"
import { VariantTinyErpIdSchema } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProductVariant } from "../../../../../hooks/api"
import { useState } from "react"

type VariantGeneralSectionProps = {
  variant: HttpTypes.AdminProductVariant
}

export function VariantTinyErpId({ variant }: VariantGeneralSectionProps) {
  const { t } = useTranslation()
  const [lock, setLock] = useState(true)

  const form = useForm<VariantTinyErpIdSchema>({
    defaultValues: {
      tiny_erp_product_id: (variant?.metadata?.tiny_erp_product_id ||
        "") as string,
    },
    resolver: zodResolver(VariantTinyErpIdSchema),
  })

  const { mutateAsync, isPending } = useUpdateProductVariant(
    variant.product_id!,
    variant.id
  )

  const handleSubmit = form.handleSubmit((data) => {
    const { tiny_erp_product_id } = data

    mutateAsync(
      {
        metadata: {
          ...variant?.metadata,
          tiny_erp_product_id: tiny_erp_product_id,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("categories.edit.successToast"))
          setLock(true)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center gap-2 px-6 py-4">
        <Heading>Tiny Erp Variation Id</Heading>
      </div>

      <div className="px-6 py-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Controller
            name="tiny_erp_product_id"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Tiny ERP Id</Label>
                <Input {...field} disabled={lock || field.disabled} />
              </div>
            )}
          />
          <div className="flex gap-4 self-end">
            <Button
              size="small"
              type="button"
              onClick={() => setLock((prev) => !prev)}
            >
              <span>{lock ? <LockOpenSolid /> : <LockClosedSolid />}</span>
              <span>{lock ? "Unlock" : "Lock"}</span>
            </Button>
            <Button
              size="small"
              type="submit"
              isLoading={isPending}
              disabled={lock || !form.formState.isDirty}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
