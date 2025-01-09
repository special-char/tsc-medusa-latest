/* eslint-disable prettier/prettier */
import { PencilSquare, PhotoSolid } from "@medusajs/icons"
import { AdminOrderLineItem, HttpTypes } from "@medusajs/types"
import {
  Alert,
  Button,
  Container,
  Heading,
  Input,
  Prompt,
  Text,
} from "@medusajs/ui"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../../../lib/client"

type orderResendNotificationSectionProps = {
  order: HttpTypes.AdminOrder
}
function getTimeDifferenceInMilliseconds(endDate: string) {
  const startTime = new Date().getTime()
  const endTime = new Date(endDate).getTime()

  return endTime - startTime
}
const OrderResendNotificationSection = ({
  order,
}: orderResendNotificationSectionProps) => {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendNotification = async ({
    template,
    data,
  }: {
    template: string
    data: AdminOrderLineItem
  }) => {
    const resendData = {
      email,
      template,
      data,
      phone,
    }

    try {
      setLoading(true)
      const resendMail = await sdk.admin.orderResendMail.create(resendData)

      if (resendMail) {
        navigate(0)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setEmail("")
    }
  }

  const isGiftCardExist = order?.items.some(
    (item) =>
      item.variant?.product?.is_giftcard === true ||
      item?.metadata?.is_giftcard === true
  )

  if (!isGiftCardExist) {
    return null
  }
  return (
    <Container className="divide-y divide-dashed p-0">
      <Heading level="h2" className="px-6 py-4">
        Email Notification Status
      </Heading>
      <div className="gap-4 px-6 py-4">
        {order?.items.map((orderItem) => {
          const scheduledDate = orderItem?.metadata?.sendDate as string
          const differenceInMilliseconds =
            getTimeDifferenceInMilliseconds(scheduledDate)
          const alertVariant =
            differenceInMilliseconds > 0
              ? "warning"
              : orderItem?.metadata?.notificationSent
                ? "success"
                : "error"

          const alertStatus =
            differenceInMilliseconds > 0
              ? "Pending"
              : orderItem?.metadata?.notificationSent
                ? "Sent"
                : "Fail"

          return (
            <div
              className="p-4 hover:bg-gray-50 flex flex-col gap-3"
              key={orderItem.id}
            >
              <div className="flex flex-row gap-5 rounded-lg items-center">
                {orderItem.thumbnail ? (
                  <img src={orderItem.thumbnail} className="h-10 w-10" />
                ) : (
                  <PhotoSolid />
                )}
                <div>
                  <Text size="base" className="text-gray-90 text-small">
                    {orderItem.title}
                  </Text>
                  {/* <Text size="small" className="text-gray-90 text-small">
                    {orderItem.variant?.title}
                  </Text> */}
                </div>
              </div>
              {orderItem.variant?.product?.is_giftcard === true ||
              orderItem?.metadata?.is_giftcard === true ? (
                <div className="flex gap-4 items-center justify-between">
                  {typeof orderItem?.metadata?.email === "string" && (
                    <Text>{orderItem.metadata.email}</Text>
                  )}
                  <Text> Notification Status</Text>
                  <Alert
                    variant={alertVariant}
                    className="flex items-center px-2 py-1"
                  >
                    {alertStatus}
                  </Alert>
                  <Prompt variant="confirmation">
                    <Prompt.Trigger asChild>
                      <Button
                        disabled={differenceInMilliseconds > 0}
                        size="small"
                      >
                        <PencilSquare />
                      </Button>
                    </Prompt.Trigger>

                    <Prompt.Content>
                      <Prompt.Header>
                        <Prompt.Title>Edit Email</Prompt.Title>
                        <Prompt.Description>
                          <Input
                            className="mb-2"
                            defaultValue={orderItem?.metadata?.email as string}
                            onChange={(e) => {
                              setEmail(e.target.value)
                            }}
                          />
                          <Input
                            defaultValue={orderItem?.metadata?.phone as string}
                            onChange={(e) => {
                              setPhone(e.target.value)
                            }}
                          />
                        </Prompt.Description>
                      </Prompt.Header>
                      <Prompt.Footer>
                        <Prompt.Cancel>Cancel</Prompt.Cancel>
                        <Button
                          type="submit"
                          size="small"
                          isLoading={loading}
                          onClick={() =>
                            handleSendNotification({
                              template: "gift-card-order-default",
                              data: orderItem,
                            })
                          }
                        >
                          Submit
                        </Button>
                      </Prompt.Footer>
                    </Prompt.Content>
                  </Prompt>
                </div>
              ) : (
                <Text>
                  Notifications and email updates are only available for gift
                  card items.
                </Text>
              )}
              {differenceInMilliseconds > 0 && (
                <Text>
                  Notification will be sent on Date:{" "}
                  {new Date(scheduledDate).toLocaleString("en-MU", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hourCycle: "h24",
                  })}
                </Text>
              )}
            </div>
          )
        })}
      </div>
    </Container>
  )
}

export default OrderResendNotificationSection
