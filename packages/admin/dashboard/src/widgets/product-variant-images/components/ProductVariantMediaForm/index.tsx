import { Fragment, useCallback, useState } from "react"
import { CustomProductVariantType } from "../../types"
import {
  Button,
  Checkbox,
  clx,
  CommandBar,
  FocusModal,
  toast,
  Tooltip,
} from "@medusajs/ui"
import { CheckCircleSolid, GridList, ThumbnailBadge } from "@medusajs/icons"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  EditProductMediaSchema,
  EditProductMediaSchemaType,
} from "../../lib/constants"
import { getDefaultValues } from "../../lib/helpers"
import { UploadMediaFormItem } from "../UploadMediaFormItem"
import { HttpTypes } from "@medusajs/framework/types"
import { useUpdateProductVariantImages } from "../../hooks/useUpdateProductVariantImages"
import { sdk } from "../../../../lib/client"

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
}

const ProductVariantMediaForm = ({
  variant,
  formId,
  open,
  onClose,
}: {
  variant: CustomProductVariantType
  formId: string
  open: boolean
  onClose: () => void
}) => {
  const [selection, setSelection] = useState<Record<string, true>>({})

  const form = useForm<EditProductMediaSchemaType>({
    defaultValues: {
      variant_media: getDefaultValues({
        selectedImages: variant.product_variant_images?.selectedImages || [],
        plpImages: variant.product_variant_images?.plpImages || [],
        images: variant.product_variant_images?.images || [],
        thumbnail: variant.product_variant_images?.thumbnail || "",
      }).map((media) => ({
        ...media,
        isDeleted: false,
      })),
    },
    resolver: zodResolver(EditProductMediaSchema),
  })

  const {
    formState: { isDirty, isLoading, isSubmitting },
  } = form

  const { fields, append, update } = useFieldArray({
    name: "variant_media",
    control: form.control,
    keyName: "field_id",
  })

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((item) => item.field_id === active.id)
      const newIndex = fields.findIndex((item) => item.field_id === over?.id)

      form.setValue("variant_media", arrayMove(fields, oldIndex, newIndex), {
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const { mutateAsync, isPending } = useUpdateProductVariantImages()

  const handleSubmit = form.handleSubmit(async ({ variant_media }) => {
    const mediaToRemove = variant_media.filter((x) => x.isDeleted)
    const mediaToSave = variant_media.filter((x) => !x.isDeleted)

    const filesToUpload = mediaToSave
      .map((m: any, i: number) => ({ file: m.file, index: i }))
      .filter((m: any) => !!m.file)

    console.log({ mediaToSave, mediaToRemove, filesToUpload })

    let uploaded: HttpTypes.AdminFile[] = []

    if (filesToUpload.length) {
      const { files: uploads } = await sdk.admin.upload
        .create({ files: filesToUpload.map((m) => m.file) })
        .catch(() => {
          form.setError("variant_media", {
            type: "invalid_file",
            message: "failed To Upload Files",
          })
          return { files: [] }
        })
      uploaded = uploads
    }

    if (mediaToRemove && mediaToRemove.length) {
      await Promise.all(
        mediaToRemove.map((x) =>
          sdk.admin.upload
            .delete(x.url.split("/").at(-1)!)
            .then(() => {
              console.log("deleted")
            })
            .catch(() => {
              console.log("error while deleting")
            })
        )
      )
    }

    console.log({ uploaded })

    const withUpdatedUrls = mediaToSave.map((entry, i) => {
      const toUploadIndex = filesToUpload.findIndex((m) => m.index === i)
      if (toUploadIndex > -1) {
        return { ...entry, url: uploaded[toUploadIndex]?.url }
      }
      return entry
    })
    const thumbnail = withUpdatedUrls.find((m) => m.isThumbnail)?.url

    await mutateAsync(
      {
        variant_id: variant.id!,
        data: {
          images: withUpdatedUrls.map((x) => x.url) || [],
          plpImages:
            withUpdatedUrls.filter((x) => x.isPlp).map((x) => x.url) || [],
          selectedImages:
            withUpdatedUrls.filter((x) => x.isSelected).map((x) => x.url) || [],
          thumbnail: thumbnail || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Successfully Updated")
          uploaded = []
          onClose()
        },
        onError: async (error) => {
          toast.error(error.message)
          console.log({ uploaded })

          if (uploaded.length) {
            await Promise.all(
              uploaded.map((x) =>
                sdk.admin.upload
                  .delete(x.id.split("/").at(-1)!)
                  .then(() => {
                    console.log("deleted")
                  })
                  .catch(() => {
                    console.log("error while deleting")
                  })
              )
            )
          }
          uploaded = []
        },
      }
    )
  })

  const handleCheckedChange = useCallback(
    (id: string) => {
      return (val: boolean) => {
        if (!val) {
          const { [id]: _, ...rest } = selection
          setSelection(rest)
        } else {
          setSelection((prev) => ({ ...prev, [id]: true }))
        }
      }
    },
    [selection]
  )

  const handleDelete = async () => {
    const ids = Object.keys(selection)
    // const indices = ids.map((id) => fields.findIndex((m) => m.id === id));
    // remove(indices);

    ids.forEach((id) => {
      const index = fields.findIndex((m) => m.id === id)
      update(index, {
        ...fields[index],
        isDeleted: true,
      })
    })

    setSelection({})
  }

  const handlePromoteToThumbnail = () => {
    const ids = Object.keys(selection)

    if (!ids.length) {
      return
    }

    const currentThumbnailIndex = fields.findIndex((m) => m.isThumbnail)

    if (currentThumbnailIndex > -1) {
      update(currentThumbnailIndex, {
        ...fields[currentThumbnailIndex],
        isThumbnail: false,
      })
    }

    const index = fields.findIndex((m) => m.id === ids[0])

    update(index, {
      ...fields[index],
      isThumbnail: true,
    })

    setSelection({})
  }

  const handleSelectedImage = () => {
    const ids = Object.keys(selection)

    if (!ids.length) {
      return
    }

    ids.forEach((id) => {
      const index = fields.findIndex((m) => m.id === id)

      update(index, {
        ...fields[index],
        isSelected: true,
      })
    })
    setSelection({})
  }

  const handleRemoveSelectedImage = () => {
    const ids = Object.keys(selection)

    if (!ids.length) {
      return
    }

    ids.forEach((id) => {
      const index = fields.findIndex((m) => m.id === id)

      update(index, {
        ...fields[index],
        isSelected: false,
      })
    })
    setSelection({})
  }

  const handlePlpImage = () => {
    const ids = Object.keys(selection)

    if (!ids.length) {
      return
    }

    ids.forEach((id) => {
      const index = fields.findIndex((m) => m.id === id)

      update(index, {
        ...fields[index],
        isPlp: true,
      })
    })
    setSelection({})
  }

  const handleRemovePlpImage = () => {
    const ids = Object.keys(selection)

    if (!ids.length) {
      return
    }

    ids.forEach((id) => {
      const index = fields.findIndex((m) => m.id === id)

      update(index, {
        ...fields[index],
        isPlp: false,
      })
    })
    setSelection({})
  }

  const selectionCount = Object.keys(selection).length

  return (
    <FocusModal open={open} onOpenChange={onClose} modal>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>Select for {variant?.title}</FocusModal.Title>
          <span></span>
        </FocusModal.Header>
        <FocusModal.Body className="h-full overflow-y-scroll">
          <form
            onSubmit={handleSubmit}
            id={formId}
            className="relative grid md:h-full md:grid-cols-[1fr_40%]"
          >
            <div className="h-full overflow-y-scroll md:border-r">
              <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
              >
                <div className="bg-ui-bg-subtle size-full overflow-auto">
                  <div className="grid h-fit auto-rows-auto grid-cols-4 gap-6 p-6">
                    <SortableContext
                      items={fields
                        .filter((m) => !m.isDeleted)
                        .map((m) => m.field_id)}
                      strategy={rectSortingStrategy}
                    >
                      {fields
                        .filter((m) => !m.isDeleted)
                        .map((m) => {
                          return (
                            <MediaGridItem
                              onCheckedChange={handleCheckedChange(m.id!)}
                              checked={!!selection[m.id!]}
                              key={m.field_id}
                              media={m}
                            />
                          )
                        })}
                    </SortableContext>
                    <DragOverlay dropAnimation={dropAnimationConfig}>
                      {activeId ? (
                        <MediaGridItemOverlay
                          media={
                            fields.find(
                              (m) => m.field_id === activeId && !m.isDeleted
                            )!
                          }
                          checked={
                            !!selection[
                              fields.find((m) => m.field_id === activeId)!.id!
                            ]
                          }
                        />
                      ) : null}
                    </DragOverlay>
                  </div>
                </div>
              </DndContext>
            </div>
            <div className="left-0 top-0 h-fit overflow-y-auto p-4 md:sticky">
              <UploadMediaFormItem form={form} append={append} />
            </div>
          </form>
          <CommandBar open={!!selectionCount}>
            <CommandBar.Bar>
              <CommandBar.Value>Selected {selectionCount}</CommandBar.Value>
              <CommandBar.Seperator />
              {selectionCount === 1 && (
                <Fragment>
                  <CommandBar.Command
                    action={handlePromoteToThumbnail}
                    label={"Make Thumbnail"}
                    shortcut="t"
                  />
                  <CommandBar.Seperator />
                </Fragment>
              )}
              <Fragment>
                <CommandBar.Command
                  action={handleSelectedImage}
                  label={"Set Selected Image"}
                  shortcut="s"
                />
                <CommandBar.Seperator />
              </Fragment>
              <Fragment>
                <CommandBar.Command
                  action={handleRemoveSelectedImage}
                  label={"Remove Selected Image"}
                  shortcut="r"
                />
                <CommandBar.Seperator />
              </Fragment>
              <Fragment>
                <CommandBar.Command
                  action={handlePlpImage}
                  label={"Set Porduct List Image"}
                  shortcut="p"
                />
                <CommandBar.Seperator />
              </Fragment>
              <Fragment>
                <CommandBar.Command
                  action={handleRemovePlpImage}
                  label={"Unset Porduct List Image"}
                  shortcut="u"
                />
                <CommandBar.Seperator />
              </Fragment>
              <CommandBar.Command
                action={handleDelete}
                label="Delete"
                shortcut="d"
              />
            </CommandBar.Bar>
          </CommandBar>
        </FocusModal.Body>
        <FocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <FocusModal.Close asChild>
              <Button variant="secondary" size="small">
                Cancel
              </Button>
            </FocusModal.Close>
            <Button
              size="small"
              type="submit"
              disabled={!isDirty}
              isLoading={isLoading || isSubmitting || isPending}
              form={formId}
            >
              Save
            </Button>
          </div>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}

interface MediaView {
  id?: string
  field_id: string
  url: string
  isThumbnail: boolean
  isSelected: boolean
  isPlp: boolean
  isDeleted?: boolean
}

interface MediaGridItemProps {
  media: MediaView
  checked: boolean
  onCheckedChange: (value: boolean) => void
}

const MediaGridItem = ({
  media,
  checked,
  onCheckedChange,
}: MediaGridItemProps) => {
  const handleToggle = useCallback(
    (value: boolean) => {
      onCheckedChange(value)
    },
    [onCheckedChange]
  )

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: media.field_id })

  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      className={clx(
        "shadow-elevation-card-rest hover:shadow-elevation-card-hover focus-visible:shadow-borders-focus bg-ui-bg-subtle-hover group relative aspect-square h-auto max-w-full overflow-hidden rounded-lg outline-none"
      )}
      style={style}
      ref={setNodeRef}
    >
      {media.isThumbnail && (
        <div className="absolute left-2 top-2">
          <Tooltip content="Thumbnail">
            <ThumbnailBadge />
          </Tooltip>
        </div>
      )}
      {media.isSelected && (
        <div className="absolute bottom-2 left-2">
          <Tooltip content="Active">
            <CheckCircleSolid className="text-green-500" />
          </Tooltip>
        </div>
      )}
      {media.isPlp && (
        <div className="absolute bottom-2 right-2">
          <Tooltip content="Product List">
            <GridList className="text-blue-500" />
          </Tooltip>
        </div>
      )}
      <div
        className={clx("absolute inset-0 cursor-grab touch-none outline-none", {
          "cursor-grabbing": isDragging,
        })}
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
      />
      <div
        className={clx("transition-fg absolute right-2 top-2 opacity-0", {
          "group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100":
            !isDragging && !checked,
          "opacity-100": checked,
        })}
      >
        <Checkbox
          onClick={(e) => {
            e.stopPropagation()
          }}
          checked={checked}
          onCheckedChange={handleToggle}
        />
      </div>
      <img
        src={media.url}
        alt=""
        className="size-full object-cover object-center"
      />
    </div>
  )
}

export const MediaGridItemOverlay = ({
  media,
  checked,
}: {
  media: MediaView
  checked: boolean
}) => {
  return (
    <div className="shadow-elevation-card-rest hover:shadow-elevation-card-hover focus-visible:shadow-borders-focus bg-ui-bg-subtle-hover group relative aspect-square h-auto max-w-full cursor-grabbing overflow-hidden rounded-lg outline-none">
      {media.isThumbnail && (
        <div className="absolute left-2 top-2">
          <ThumbnailBadge />
        </div>
      )}
      {media.isSelected && (
        <div className="absolute bottom-2 left-2">
          <Tooltip content="Active">
            <CheckCircleSolid className="text-green-500" />
          </Tooltip>
        </div>
      )}
      {media.isPlp && (
        <div className="absolute bottom-2 right-2">
          <Tooltip content="Product List">
            <GridList className="text-blue-500" />
          </Tooltip>
        </div>
      )}
      <div
        className={clx("transition-fg absolute right-2 top-2 opacity-0", {
          "opacity-100": checked,
        })}
      >
        <Checkbox checked={checked} />
      </div>
      <img
        src={media.url}
        alt=""
        className="size-full object-cover object-center"
      />
    </div>
  )
}

export default ProductVariantMediaForm
