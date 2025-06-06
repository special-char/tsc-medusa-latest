import { FeraReview } from "../../types"
import { Container, Heading, Text } from "@medusajs/ui"

type FeraReviewMediaSectionProps = {
  review: FeraReview
}

export const FeraReviewMediaSection = ({
  review,
}: FeraReviewMediaSectionProps) => {
  const { media } = review

  if (media.length === 0) {
    return null
  }

  return (
    <Container className="divide-y p-0">
      {/* <div className="flex flex-col gap-y-4"> */}
      <Heading level="h2" className="px-6 py-4">
        Media
      </Heading>
      <div className=" grid grid-cols-2 gap-4 px-6 py-4 sm:grid-cols-3 md:grid-cols-4">
        {media.map((item) => (
          <div key={item.id} className="relative aspect-square">
            {item.type === "photo" ? (
              <img
                src={item.url}
                alt={item.caption || "Review media"}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <video
                src={item.url}
                controls
                className="h-full w-full rounded-lg object-cover"
              />
            )}
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <Text className="text-sm text-white">{item.caption}</Text>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* </div> */}
    </Container>
  )
}
