import { RouteFocusModal } from "../../../components/modals"
import {
  Controller,
  FieldValues,
  Form,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { Button, Select, Text, Textarea } from "@medusajs/ui"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/client"
import { Event } from "../notification-template-list/components/notification-template-list-table"

const fetchEvents = async (setEvent: Dispatch<SetStateAction<Event[]>>) => {
  try {
    const eventData = await sdk.admin.notificationTemplate.listEvent()
    setEvent(eventData.data)
    // return eventData
  } catch (error) {
    console.log(error)
  }
}
const createGiftTemplates = async (data: any) => {
  try {
    const res = await sdk.admin.notificationTemplate.create(data)
    return res
  } catch (error) {
    console.log(error)
  }
}

export const NotificationTemplateCreate = () => {
  const navigate = useNavigate()
  const [eventList, setEventList] = useState<Event[]>([])

  useEffect(() => {
    fetchEvents(setEventList)
    return () => {}
  }, [])
  console.log({ eventList })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FieldValues>({
    defaultValues: useMemo(() => {
      return {
        event_id: "",
        template: "",
      }
    }, []),
    mode: "onBlur",
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      console.log("data", data)

      await createGiftTemplates(data)
      navigate("/settings/notification-template")
      navigate(0)
    } catch (error) {
      console.log("onSubmit error", error)
    }
  }

  return (
    <RouteFocusModal>
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="relative w-full overflow-y-scroll px-8 py-16">
        <Form control={control} onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Controller
                name="event_id"
                control={control}
                rules={{ required: "Event name is required" }}
                render={({ field }) => {
                  return (
                    <>
                      <Select onValueChange={field.onChange}>
                        <Select.Trigger>
                          <Select.Value placeholder="Select an event" />
                        </Select.Trigger>
                        <Select.Content>
                          {eventList.map((item) => (
                            <Select.Item key={item.id} value={item?.id}>
                              {item.eventName}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </>
                  )
                }}
              />
              {errors.eventName && (
                <Text className="text-red-500">
                  {errors?.eventName?.message as string}
                </Text>
              )}
            </div>
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
                  <Textarea value={field.value} onChange={field.onChange} />
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
