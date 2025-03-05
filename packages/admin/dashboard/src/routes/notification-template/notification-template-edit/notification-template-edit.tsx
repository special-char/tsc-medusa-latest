import { RouteFocusModal } from "../../../components/modals"
import {
  Controller,
  FieldValues,
  Form,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { Button, Label, Text, Textarea } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/client"
import NotificationTemplateForm from "../common/components/NotificationTempalteForm"
import { Event } from "../notification-template-list/components/notification-template-list-table"
import TagList from "../common/components/TagList"

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

const formFields = [
  // {
  //   name: "event_id",
  //   label: "Event",
  //   type: "select",
  //   required: true,
  // },
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

export const NotificationEdit = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [tags, setTags] = useState<Event["tags"]>({})
  console.log({ state })

  const formMethods = useForm<FieldValues>({
    defaultValues: useMemo(() => {
      return {
        template: state.template,
        subject: state.subject,
      }
    }, [state.subject, state.template]),
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
  const insertTag = (tag: string) => {
    const textarea = document.getElementById(
      "contentTextarea"
    ) as HTMLTextAreaElement

    if (!textarea) {
      return
    }

    const start = textarea.selectionStart

    const end = textarea.selectionEnd

    const currentValue = formMethods.getValues("template")

    const newValue =
      currentValue.substring(0, start) +
      `{{${tag}}}` +
      currentValue.substring(end)

    formMethods.setValue("template", newValue)

    // Move cursor after inserted tag

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd =
        start + `{{${tag}}}`.length

      textarea.focus()
    }, 0)
  }
  return (
    <RouteFocusModal>
      <RouteFocusModal.Header>
        {state.event_id.eventName}
      </RouteFocusModal.Header>
      <RouteFocusModal.Body className="relative flex w-full overflow-y-scroll px-8 py-16">
        <NotificationTemplateForm
          setTags={setTags}
          formFields={formFields}
          onSubmit={onSubmit}
          formMethods={formMethods}
        />
        <div className="flex flex-1 flex-col p-4">
          <Text size="small">Available Tags</Text>
          <TagList
            tags={state.event_id.tags}
            onClick={(tag: string) => {
              insertTag(tag)
            }}
          />
        </div>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
