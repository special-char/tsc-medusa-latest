import { FeraReview } from "../../types"
import { Container, Heading, Text, Copy } from "@medusajs/ui"
import { useDate } from "../../../../hooks/use-date"

type FeraReviewInfoSectionProps = {
  review: FeraReview
}

export const FeraReviewInfoSection = ({
  review,
}: FeraReviewInfoSectionProps) => {
  const { getFullDate } = useDate()

  return (
    <Container>
      <div className="flex flex-col ">
        <div className="flex items-center gap-x-1">
          <Heading>{review.id}</Heading>
          <Copy content={review.id} className="text-ui-fg-muted" />
        </div>
        <Text size="small" className="text-ui-fg-subtle">
          Created: {getFullDate({ date: review.created_at })}
        </Text>
      </div>
    </Container>
  )
}
