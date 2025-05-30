import { CustomProductVariantType } from "../../types"
import { getVariantMedia } from "../../lib/helpers"
import { clx, Heading, Text, Tooltip } from "@medusajs/ui"
import {
  CheckCircleSolid,
  GridList,
  PencilSquare,
  ThumbnailBadge,
} from "@medusajs/icons"
import { ActionMenu } from "../ActionMenu"
import { PropsWithChildren } from "react"

const ProductVariantImageListSection = ({
  variant,
  onEdit,
}: {
  variant: CustomProductVariantType
  onEdit: () => void
}) => {
  const media = getVariantMedia(variant)

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <Heading level="h3">{variant.title}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: "edit",
                  onClick: onEdit,
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      {media.length ? (
        <ImageBlockGrid>
          {media.map((i) => {
            // const isSelected = selection[i.id];

            return (
              <ImageBlock key={i.id}>
                {/* <div
									className={clx(
										"transition-fg invisible absolute right-2 top-2 opacity-0 group-hover:visible group-hover:opacity-100",
										{
											"visible opacity-100": isSelected,
										}
									)}
								>
									<Checkbox
										checked={selection[i.id] || false}
										onCheckedChange={() => handleCheckedChange(i.id)}
									/>
								</div> */}
                {i.isThumbnail && <ImageBlockIsThumbnail />}
                {i.isSelected && (
                  <div className="absolute bottom-2 left-2">
                    <Tooltip content="Active">
                      <CheckCircleSolid className="text-green-500" />
                    </Tooltip>
                  </div>
                )}
                {i.isPlp && (
                  <div className="absolute bottom-2 right-2">
                    <Tooltip content="Product List">
                      <GridList className="text-blue-500" />
                    </Tooltip>
                  </div>
                )}
                <img
                  src={i.url}
                  alt={`${variant.title} image`}
                  className="size-full object-cover"
                />
              </ImageBlock>
            )
          })}
        </ImageBlockGrid>
      ) : (
        <ImageBlockGrid>
          {Array.from({ length: 4 }).map((_, idx) => (
            <EmptyImageBlock key={idx} />
          ))}
        </ImageBlockGrid>
      )}
    </div>
  )
}

const ImageBlockGrid = ({ children }: PropsWithChildren) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4 py-4">
      {children}
    </div>
  )
}
const ImageBlock = ({
  children,
  className,
}: PropsWithChildren & { className?: string }) => {
  return (
    <div
      className={clx(
        "shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]",
        className
      )}
    >
      {children}
    </div>
  )
}
const ImageBlockIsThumbnail = () => {
  return (
    <div className="absolute left-2 top-2">
      <Tooltip content="Thumbnail">
        <ThumbnailBadge />
      </Tooltip>
    </div>
  )
}
const EmptyImageBlock = () => {
  return (
    <ImageBlock className="flex items-center justify-center">
      <Text
        size="small"
        leading="compact"
        weight="plus"
        className="text-ui-fg-subtle"
      >
        No media yet
      </Text>
    </ImageBlock>
  )
}

export default ProductVariantImageListSection
