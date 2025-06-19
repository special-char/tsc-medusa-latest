import { FeraReview } from "../../types"
import { Container, Heading, Text, StatusBadge } from "@medusajs/ui"
import { useDate } from "../../../../hooks/use-date"
import { StarRating } from "./star-rating"

type FeraReviewGeneralSectionProps = {
  review: FeraReview
}

export const FeraReviewGeneralSection = ({
  review,
}: FeraReviewGeneralSectionProps) => {
  return (
    <Container className="divide-y p-0">
      <Header review={review} />
      <HeadingInfo review={review} />
      <ReviewBody review={review} />
      <RatingInfo review={review} />
      {/* <StatusInfo review={review} /> */}
      <DeclineReasons review={review} />
      <ChannelInfo review={review} />
      <StoreReply review={review} />
      <ProductInfo review={review} />
    </Container>
  )
}

const Header = ({ review }: { review: FeraReview }) => {
  const { getFullDate } = useDate()

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">Review Details</Heading>
      <Text size="small" className="text-ui-fg-subtle">
        Created: {getFullDate({ date: review.created_at })}
      </Text>
    </div>
  )
}

const RatingInfo = ({ review }: { review: FeraReview }) => {
  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Rating
      </Text>
      <StarRating rating={review.rating} />
    </div>
  )
}

const HeadingInfo = ({ review }: { review: FeraReview }) => {
  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Heading
      </Text>
      <Text size="small" leading="compact">
        {review.heading}
      </Text>
    </div>
  )
}

const ReviewBody = ({ review }: { review: FeraReview }) => {
  if (!review.body) {
    return null
  }

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Review
      </Text>
      <Text size="small" leading="compact">
        {review.body}
      </Text>
    </div>
  )
}

const StatusInfo = ({ review }: { review: FeraReview }) => {
  let color = "grey"
  let status = "N/A"

  switch (review.state || "") {
    case "approved":
      color = "green"
      status = "Approved"
      break
    case "pending":
    case "pending_approval":
    case "pending_update":
      color = "blue"
      status = "Pending"
      break
    case "declined_approval":
      color = "orange"
      status = "Declined"
      break
    default:
      break
  }

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Status
      </Text>
      <StatusBadge color={color as any}>{status}</StatusBadge>
    </div>
  )
}

const DeclineReasons = ({ review }: { review: FeraReview }) => {
  if (!review.decline_reasons?.length) {
    return null
  }

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Decline Reasons
      </Text>
      <div className="flex flex-wrap gap-2">
        {review.decline_reasons.map((reason, index) => (
          <Text key={index}>{reason}</Text>
        ))}
      </div>
    </div>
  )
}

const ChannelInfo = ({ review }: { review: FeraReview }) => {
  if (!review.channel) {
    return null
  }

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Channel
      </Text>
      <Text size="small" leading="compact">
        {review.channel.name}
      </Text>
    </div>
  )
}

const StoreReply = ({ review }: { review: FeraReview }) => {
  const { getFullDate } = useDate()

  if (!review.store_reply) {
    return null
  }

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Store Reply
      </Text>
      <div className="flex flex-col gap-y-2">
        <Text size="small" leading="compact">
          {review.store_reply.body}
        </Text>
        <Text size="small" className="text-ui-fg-subtle">
          By {review.store_reply.name} on{" "}
          {getFullDate({ date: review.store_reply.created_at })}
        </Text>
      </div>
    </div>
  )
}

const ProductInfo = ({ review }: { review: FeraReview }) => {
  if (!review.product) {
    return null
  }

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Product
      </Text>
      <Text size="small" leading="compact">
        {review.product.name || review.product.code}
      </Text>
    </div>
  )
}
