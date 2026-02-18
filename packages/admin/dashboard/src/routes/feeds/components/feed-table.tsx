import { useState } from "react"
import {
  Button,
  Container,
  Heading,
  Table,
  StatusBadge,
  toast,
} from "@medusajs/ui"
import { Trash, Plus, ArrowPath, PencilSquare } from "@medusajs/icons"
import { useFeeds } from "../hooks/useFeeds"
import { useDeleteFeed } from "../hooks/useDeleteFeed"
import { useGenerateFeed } from "../hooks/useGenerateFeed"
import { sdk } from "../../../lib/client/client"
import { CreateFeedModal } from "./create-feed-modal"

type FeedStatus = "active" | "inactive" | "draft" | "generating" | "error"

interface Feed {
  id: string
  name: string
  platform: string
  status: FeedStatus
  file_type: string
  feed_url: string | null
  last_generated_at: string | null
  created_at: string
  country: string
  file_name: string
  include_variations: boolean
  field_mappings?: any[]
}

const getStatusColor = (
  status: FeedStatus
): "green" | "red" | "orange" | "blue" | "grey" => {
  switch (status) {
    case "active":
      return "green"
    case "error":
      return "red"
    case "generating":
      return "orange"
    case "inactive":
      return "grey"
    default:
      return "blue"
  }
}

const FeedRow = ({
  feed,
  onEdit,
}: {
  feed: Feed
  onEdit: (feed: Feed) => void
}) => {
  const { mutateAsync: deleteFeed, isPending: isDeleting } = useDeleteFeed()
  const { mutateAsync: generateFeed, isPending: isGenerating } =
    useGenerateFeed()

  return (
    <Table.Row key={feed.id}>
      <Table.Cell>{feed.name}</Table.Cell>
      <Table.Cell className="capitalize">
        {feed.platform.replace("_", " ")}
      </Table.Cell>
      <Table.Cell>
        <StatusBadge color={getStatusColor(feed.status)}>
          {feed.status}
        </StatusBadge>
      </Table.Cell>
      <Table.Cell className="uppercase">{feed.file_type}</Table.Cell>
      <Table.Cell>
        {feed.last_generated_at
          ? new Date(feed.last_generated_at).toLocaleString()
          : "Never"}
      </Table.Cell>
      <Table.Cell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            size="small"
            variant="secondary"
            onClick={async () => {
              try {
                await generateFeed(feed.id)
                toast.success("Feed generation started")
              } catch (error: any) {
                toast.error(error.message || "Failed to generate feed")
              }
            }}
            isLoading={isGenerating}
            disabled={isGenerating}
          >
            <ArrowPath /> Generate
          </Button>
          <Button
            size="small"
            variant="secondary"
            onClick={async () => {
              const response = await sdk.client.fetch<{ feed: Feed }>(
                `/admin/feeds/${feed.id}`
              )
              onEdit(response.feed)
            }}
          >
            <PencilSquare /> Edit
          </Button>
          {feed.feed_url && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => window.open(feed.feed_url!, "_blank")}
            >
              View Feed
            </Button>
          )}
          <Button
            size="small"
            variant="transparent"
            onClick={async () => {
              if (confirm("Are you sure you want to delete this feed?")) {
                try {
                  await deleteFeed(feed.id)
                  toast.success("Feed deleted successfully")
                } catch (error: any) {
                  toast.error(error.message || "Failed to delete feed")
                }
              }
            }}
            disabled={isDeleting}
          >
            <Trash />
          </Button>
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export const FeedTable = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingFeed, setEditingFeed] = useState<Feed | null>(null)
  const { feeds, isLoading } = useFeeds()

  return (
    <>
      {!createModalOpen && !editingFeed && (
        <Container className="divide-y p-0">
          <div className="flex items-center justify-between px-6 py-4">
            <Heading level="h2">Product Feeds</Heading>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus /> Create Feed
            </Button>
          </div>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Platform</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>File Type</Table.HeaderCell>
                <Table.HeaderCell>Last Generated</Table.HeaderCell>
                <Table.HeaderCell className="text-right">
                  Actions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell
                    {...({ colSpan: 6 } as any)}
                    className="text-center"
                  >
                    Loading feeds...
                  </Table.Cell>
                </Table.Row>
              ) : feeds && feeds.length > 0 ? (
                feeds.map((feed: Feed) => (
                  <FeedRow
                    key={feed.id}
                    feed={feed}
                    onEdit={(feed) => setEditingFeed(feed)}
                  />
                ))
              ) : (
                <Table.Row>
                  <Table.Cell
                    {...({ colSpan: 6 } as any)}
                    className="text-center"
                  >
                    No feeds found. Create your first feed to get started.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Container>
      )}

      {(createModalOpen || editingFeed) && (
        <CreateFeedModal
          open={createModalOpen || !!editingFeed}
          onOpenChange={(open: boolean) => {
            setCreateModalOpen(open)
            if (!open) {
              setEditingFeed(null)
            }
          }}
          feedToEdit={editingFeed || undefined}
        />
      )}
    </>
  )
}
