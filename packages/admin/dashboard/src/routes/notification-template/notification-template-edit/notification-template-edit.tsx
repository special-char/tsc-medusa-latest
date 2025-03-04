import { RouteFocusModal } from "../../../components/modals"
import {
  Controller,
  FieldValues,
  Form,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { Button, Label, Text, Textarea } from "@medusajs/ui"
import { useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/client"

const createGiftTemplates = async (data: any) => {
  try {
    const res = await sdk.admin.gifttemplate.create(data)
    return res
  } catch (error) {
    console.log(error)
  }
}

const updateGiftTemplates = async ({ id, data }: { id: string; data: any }) => {
  try {
    const res = await sdk.admin.notificationTemplate.update(id, data)
    return res
  } catch (error) {
    console.log(error)
  }
}

export const NotificationEdit = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  console.log({ state })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FieldValues>({
    defaultValues: useMemo(() => {
      return {
        template: state.template,
      }
    }, []),
    mode: "onBlur",
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      if (state) {
        await updateGiftTemplates({ id: state?.id, data })
      } else {
        await createGiftTemplates(data)
      }
      navigate("/settings/notification-template")
      // navigate(0)
    } catch (error) {
      console.log("onSubmit error", error)
    }
  }
  return (
    <RouteFocusModal>
      <RouteFocusModal.Header>
        {state.event_id.eventName}
      </RouteFocusModal.Header>
      <RouteFocusModal.Body className="relative w-full overflow-y-scroll px-8 py-16">
        <Form control={control} onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Controller
                name="template"
                control={control}
                rules={{
                  required: "Template is required",
                  pattern: {
                    value:
                      /<[^>]+>\s*[^<>\s][\s\S]*?<\/[^>]+>|<(img|iframe|video|a)\b[^>]*\/?>/,
                    message: "Invalid email Template",
                  },
                }}
                render={({ field }) => (
                  <>
                    <Label>Email template</Label>
                    <Textarea value={field.value} onChange={field.onChange} />
                  </>
                )}
              />
              {errors.template && (
                <Text className="text-red-500">
                  {errors.template.message as string}
                </Text>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Form>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
