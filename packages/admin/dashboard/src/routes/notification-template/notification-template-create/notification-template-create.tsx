import { RouteFocusModal } from "../../../components/modals"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { Text } from "@medusajs/ui"
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/client"
import { Event } from "../notification-template-list/components/notification-template-list-table"
import TagList from "../common/components/TagList"
import NotificationTemplateForm from "../common/components/NotificationTempalteForm"

const formFields = [
  {
    name: "event_id",
    label: "Event",
    type: "select",
    required: true,
  },
  {
    name: "subject",
    label: "Subject",
    type: "Input",
    required: true,
    props: {
      placeholder: "Congratulations on your purchase",
    },
  },
  {
    name: "template",
    label: "Template (HTML format)",
    type: "Textarea",
    required: true,
    props: {
      id: "contentTextarea",
      placeholder: "<html>...</html>",
      className: "min-h-52",
    },
  },
]

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
  const [tags, setTags] = useState<Event["tags"]>({})

  useEffect(() => {
    fetchEvents(setEventList)
    return () => {}
  }, [])

  const formMethods = useForm<FieldValues>({
    defaultValues: useMemo(() => {
      return {
        event_id: "",
        template: "",
        subject: "",
      }
    }, []),
    mode: "onBlur",
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await createGiftTemplates(data)
      navigate("/settings/notification-template")
      navigate(0)
    } catch (error) {
      console.log("onSubmit error", error)
    }
  }

  const useLastFocusedElement = () => {
    const lastFocusedRef = useRef<
      HTMLInputElement | HTMLTextAreaElement | null
    >(null)

    useEffect(() => {
      const handleFocusIn = (event: FocusEvent) => {
        if (
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement
        ) {
          lastFocusedRef.current = event.target
        }
      }

      document.addEventListener("focusin", handleFocusIn)
      return () => document.removeEventListener("focusin", handleFocusIn)
    }, [])

    return lastFocusedRef
  }
  const lastFocusedRef = useLastFocusedElement()

  const insertTag = (
    tag: string,
    lastFocusedRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputElement = lastFocusedRef.current
    if (!inputElement) {
      console.warn("No input or textarea was previously focused.")
      return
    }

    const {
      selectionStart: start = 0,
      selectionEnd: end = 0,
      value,
    } = inputElement

    // Insert the tag at the cursor position
    inputElement.value = `${value.slice(0, start)}{{${tag}}}${value.slice(end)}`

    // Restore cursor position and focus
    setTimeout(() => {
      inputElement.setSelectionRange(
        start + `{{${tag}}}`.length,
        start + `{{${tag}}}`.length
      )
      inputElement.focus()
    }, 0)
  }

  console.log({ active: document.activeElement })

  return (
    <RouteFocusModal>
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="relative flex w-full overflow-y-scroll px-8 py-16">
        <NotificationTemplateForm
          setTags={setTags}
          formFields={formFields}
          onSubmit={onSubmit}
          eventList={eventList}
          formMethods={formMethods}
        />
        {/* <Form
          className="flex flex-[2]"
          control={control}
          onSubmit={formMethods.handleSubmit(onSubmit)}
        >
          <div className="flex flex-1 flex-col space-y-4">
            {formFields.map((formField) => {
              return (
                <div key={formField.name}>
                  <Controller
                    name={formField.name}
                    control={control}
                    rules={{ required: `${formField.label} is required` }}
                    render={({ field }) => {
                      return (
                        <>
                          <Label>{formField.label}</Label>
                          {formField.type === "select" ? (
                            <Select
                              onValueChange={(v) => {
                                field.onChange(v)
                                setTags(
                                  eventList?.find((item) => item?.id === v)
                                    ?.tags
                                )
                              }}
                            >
                              <Select.Trigger>
                                <Select.Value
                                  placeholder={`Select an ${field.label}`}
                                />
                              </Select.Trigger>
                              <Select.Content>
                                {eventList.map((item) => (
                                  <Select.Item key={item.id} value={item?.id}>
                                    {item.eventName}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          ) : (
                            <Textarea
                              id="contentTextarea"
                              className="min-h-52"
                              placeholder="<html>...</html>"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        </>
                      )
                    }}
                  />
                  {errors[formField.name] && (
                    <Text className="text-red-500">
                      {errors[formField.name]?.message as string}
                    </Text>
                  )}
                </div>
              )
            })}
            <Button type="submit" disabled={formMethods.formState.isSubmitting}>
              {formMethods.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Form> */}
        <div className="flex flex-1 flex-col p-4">
          <Text size="small">Available Tags</Text>
          <TagList
            tags={tags}
            onClick={(tag: string) => {
              insertTag(tag, lastFocusedRef)
            }}
          />
        </div>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
