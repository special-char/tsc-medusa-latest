import { Avatar, Container, Copy, Heading, Text, Badge } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { FeraReview } from "../../types"

type FeraReviewCustomerSectionProps = {
  review: FeraReview
}

export const FeraReviewCustomerSection = ({
  review,
}: FeraReviewCustomerSectionProps) => {
  const { customer } = review

  return (
    <Container className="divide-y p-0">
      <Header review={review} />
      <CustomerInfoID data={customer} />
      <CustomerInfoContact data={customer} />
      <CustomerReviewCount data={customer} />
      <CustomerInfoLocation data={customer} />
      <CustomerChannel data={customer} />
    </Container>
  )
}

const Header = ({ review }: { review: FeraReview }) => {
  const { t } = useTranslation()
  const { customer } = review

  const displayName =
    customer.display_name || customer.generated_display_name || "Anonymous"
  const fallback = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("fields.customer")}</Heading>
      <Avatar src={customer.avatar_url} fallback={fallback} size="small" />
    </div>
  )
}

const CustomerInfoID = ({ data }: { data: any }) => {
  const displayName =
    data.display_name || data.generated_display_name || "Anonymous"

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Name
      </Text>
      <div className="flex items-center gap-x-2 overflow-hidden">
        {/* <Avatar src={data.avatar_url} fallback={fallback} size="2xsmall" /> */}
        <div className="flex flex-col">
          <Text
            size="small"
            leading="compact"
            className="text-ui-fg-subtle hover:text-ui-fg-base transition-fg truncate"
          >
            {displayName}
          </Text>
          {data.is_verified && <Badge>Verified</Badge>}
        </div>
      </div>
    </div>
  )
}

const CustomerInfoContact = ({ data }: { data: any }) => {
  const { t } = useTranslation()

  const email = data.email
  const phone = data.phone_number

  if (!email && !phone) {
    return null
  }

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {t("orders.customer.contactLabel")}
      </Text>
      <div className="flex flex-col gap-y-2">
        {email && (
          <div className="grid grid-cols-[1fr_20px] items-start gap-x-2">
            <Text
              size="small"
              leading="compact"
              className="text-pretty break-all"
            >
              {email}
            </Text>
            <div className="flex justify-end">
              <Copy content={email} className="text-ui-fg-muted" />
            </div>
          </div>
        )}
        {phone && (
          <div className="grid grid-cols-[1fr_20px] items-start gap-x-2">
            <Text
              size="small"
              leading="compact"
              className="text-pretty break-all"
            >
              {phone}
            </Text>
            <div className="flex justify-end">
              <Copy content={phone} className="text-ui-fg-muted" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const CustomerReviewCount = ({ data }: { data: any }) => {
  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Reviews
      </Text>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <Text size="small" leading="compact">
            {data.counts.reviews}
          </Text>
        </div>
      </div>
    </div>
  )
}

const CustomerInfoLocation = ({ data }: { data: any }) => {
  const { t } = useTranslation()

  const location = data.display_location || data.generated_display_location

  if (!location) {
    return null
  }

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {t("fields.location")}
      </Text>
      <Text size="small" leading="compact">
        {location}
      </Text>
    </div>
  )
}

const CustomerChannel = ({ data }: { data: any }) => {
  const channel = [
    data.is_anonymous && "Anonymous",
    data.is_verified && "Verified",
    data.is_from_supplier && "Supplier",
    data.is_test && "Test Account",
  ].filter(Boolean)

  if (channel.length === 0) {
    return null
  }

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Channel
      </Text>
      <div className="font flex flex-wrap gap-2">
        {channel.map((channel) => (
          <Text size="small" key={channel}>
            {channel}
          </Text>
        ))}
      </div>
    </div>
  )
}
