import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  FocusModal,
  Button,
  Input,
  Select,
  Label,
  Checkbox,
  toast,
  Text,
} from "@medusajs/ui"
import { Plus, Trash } from "@medusajs/icons"
import { sdk } from "../../../lib/client/client"
import { useCreateFeed } from "../hooks/useCreateFeed"
import { useUpdateFeed } from "../hooks/useUpdateFeed"
import { useFeedTemplates } from "../hooks/useFeedTemplates"

interface Template {
  name: string
  platform: string
  required_fields: any[]
  optional_fields: any[]
}

interface FieldMapping {
  platform_attribute: string
  source_type: string
  mapping_value: string
  prefix?: string
  suffix?: string
  output_type?: string
  sort_order: number
}

interface Region {
  id: string
  name: string
  countries: {
    id: string
    iso_2: string
    display_name: string
  }[]
}

interface CreateFeedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feedToEdit?: {
    id: string
    name: string
    country: string
    platform: string
    file_type: string
    file_name: string
    base_url?: string
    include_variations: boolean
    status: string
    field_mappings?: FieldMapping[]
    metadata?: Record<string, any>
  }
}

export const CreateFeedModal = ({
  open,
  onOpenChange,
  feedToEdit,
}: CreateFeedModalProps) => {
  const [formData, setFormData] = useState({
    name: feedToEdit?.name || "",
    country: feedToEdit?.country || "US",
    platform: feedToEdit?.platform || "google_shopping",
    file_type: feedToEdit?.file_type || "xml",
    file_name: feedToEdit?.file_name || "",
    base_url: feedToEdit?.base_url || "",
    include_variations: feedToEdit?.include_variations ?? true,
    status: feedToEdit?.status || "draft",
  })
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>(
    feedToEdit?.field_mappings || []
  )
  const [additionalDataFields, setAdditionalDataFields] = useState<string[]>(
    (feedToEdit?.metadata as any)?.additional_data_fields || []
  )

  // Fetch templates
  const { templates: templatesData } = useFeedTemplates({ enabled: open })

  // Fetch regions
  const { data: regionsData } = useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ regions: Region[] }>(
        "/admin/regions"
      )
      return response.regions
    },
    enabled: open,
  })

  // Get unique countries from regions
  const uniqueCountries =
    regionsData
      ?.flatMap((region: Region) => region.countries)
      .filter(
        (country: any, index: number, self: any[]) =>
          index === self.findIndex((c) => c.iso_2 === country.iso_2)
      )
      .sort((a: any, b: any) => a.display_name.localeCompare(b.display_name)) ||
    []

  // Load template when platform changes (only when creating new feed, not editing)
  useEffect(() => {
    if (templatesData && formData.platform && !feedToEdit) {
      const template = templatesData.find(
        (t: Template) => t.platform === formData.platform
      )
      if (template) {
        const allFields = [
          ...template.required_fields,
          ...template.optional_fields,
        ]
        setFieldMappings(allFields)
      }
    }
  }, [formData.platform, templatesData, feedToEdit])

  // Mutations
  const { mutateAsync: createFeed, isPending: isCreating } = useCreateFeed()
  const { mutateAsync: updateFeed, isPending: isUpdating } = useUpdateFeed(
    feedToEdit?.id || ""
  )

  const resetForm = () => {
    setFormData({
      name: "",
      country: "US",
      platform: "google_shopping",
      file_type: "xml",
      file_name: "",
      base_url: "",
      include_variations: true,
      status: "draft",
    })
    setFieldMappings([])
  }

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.file_name ||
      !formData.base_url ||
      fieldMappings.length === 0
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    const payload = {
      ...formData,
      status: ["active", "inactive", "draft"].includes(formData.status)
        ? formData.status
        : undefined,
      field_mappings: fieldMappings,
      metadata: {
        ...(feedToEdit?.metadata || {}),
        additional_data_fields: additionalDataFields.filter(Boolean),
      },
    }

    try {
      if (feedToEdit) {
        await updateFeed(payload)
        toast.success("Feed updated successfully")
      } else {
        await createFeed(payload)
        toast.success("Feed created successfully")
      }
      onOpenChange(false)
      resetForm()
    } catch (error: any) {
      toast.error(
        error.message || `Failed to ${feedToEdit ? "update" : "create"} feed`
      )
    }
  }

  const updateMapping = (index: number, field: string, value: string) => {
    const updated = [...fieldMappings]
    updated[index] = { ...updated[index], [field]: value }
    setFieldMappings(updated)
  }

  const removeMapping = (index: number) => {
    setFieldMappings(fieldMappings.filter((_, i) => i !== index))
  }

  const addMapping = () => {
    setFieldMappings([
      ...fieldMappings,
      {
        platform_attribute: "",
        source_type: "attribute",
        mapping_value: "",
        sort_order: fieldMappings.length + 1,
      },
    ])
  }

  const addDataField = () => {
    setAdditionalDataFields([...additionalDataFields, ""])
  }

  const updateDataField = (index: number, value: string) => {
    const updated = [...additionalDataFields]
    updated[index] = value
    setAdditionalDataFields(updated)
  }

  const removeDataField = (index: number) => {
    setAdditionalDataFields(additionalDataFields.filter((_, i) => i !== index))
  }

  const isPending = isCreating || isUpdating

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Header>
        <div className="flex items-center justify-between">
          <FocusModal.Title>
            {feedToEdit ? "Edit Product Feed" : "Create Product Feed"}
          </FocusModal.Title>
        </div>
      </FocusModal.Header>
      <FocusModal.Body className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-4">
          <div>
            <Label htmlFor="name">Feed Name*</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Google Shopping US"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country*</Label>
              <Select
                value={formData.country}
                onValueChange={(value) =>
                  setFormData({ ...formData, country: value })
                }
              >
                <Select.Trigger>
                  <Select.Value placeholder="Select country" />
                </Select.Trigger>
                <Select.Content>
                  {uniqueCountries.map((country: any) => (
                    <Select.Item
                      key={country.iso_2}
                      value={country.iso_2.toUpperCase()}
                    >
                      {country.display_name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>

            <div>
              <Label htmlFor="platform">Platform*</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value })
                }
              >
                <Select.Trigger>
                  <Select.Value placeholder="Select platform" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="google_shopping">
                    Google Shopping
                  </Select.Item>
                  <Select.Item value="meta">
                    Meta (Facebook & Instagram)
                  </Select.Item>
                  <Select.Item value="tiktok">TikTok</Select.Item>
                  <Select.Item value="pinterest">Pinterest</Select.Item>
                  <Select.Item value="klaviyo">Klaviyo</Select.Item>
                  <Select.Item value="chatgpt">ChatGPT (OpenAI)</Select.Item>
                  <Select.Item value="tolstoy">Tolstoy</Select.Item>
                  <Select.Item value="csv">Generic CSV</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file_type">File Type*</Label>
              <Select
                value={formData.file_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, file_type: value })
                }
              >
                <Select.Trigger>
                  <Select.Value placeholder="Select file type" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="xml">XML</Select.Item>
                  <Select.Item value="csv">CSV</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div>
              <Label htmlFor="file_name">File Name*</Label>
              <Input
                id="file_name"
                value={formData.file_name}
                onChange={(e) =>
                  setFormData({ ...formData, file_name: e.target.value })
                }
                placeholder="google_shopping_us"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="base_url">Base URL*</Label>
            <Input
              id="base_url"
              value={formData.base_url}
              onChange={(e) =>
                setFormData({ ...formData, base_url: e.target.value })
              }
              placeholder="https://www.xyz.com"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="include_variations"
              checked={formData.include_variations}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  include_variations: checked as boolean,
                })
              }
            />
            <Label htmlFor="include_variations">
              Include product variations
            </Label>
          </div>

          <div>
            <Label htmlFor="additional_data_fields">
              Additional Data Fields (one per line)
            </Label>
            <Text size="small" className="text-ui-fg-subtle mb-2">
              Specify extra fields to fetch from the product module (e.g.
              metadata.custom_field, weight, height)
            </Text>
            <div className="flex flex-col gap-2">
              {additionalDataFields.map((field, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={field}
                    onChange={(e) => updateDataField(index, e.target.value)}
                    placeholder="e.g. metadata.custom_field"
                    size="small"
                  />
                  <Button
                    size="small"
                    variant="transparent"
                    onClick={() => removeDataField(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
              <Button
                size="small"
                variant="secondary"
                onClick={addDataField}
                className="w-fit"
              >
                <Plus /> Add Data Field
              </Button>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Text size="small" weight="plus">
                Field Mappings
              </Text>
              <Button size="small" variant="secondary" onClick={addMapping}>
                <Plus /> Add Field
              </Button>
            </div>

            <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
              {fieldMappings.map((mapping, index) => (
                <div
                  key={index}
                  className="bg-ui-bg-subtle flex items-center gap-2 rounded p-2"
                >
                  <div className="grid flex-1 grid-cols-3 gap-2">
                    <Input
                      placeholder="Attribute"
                      value={mapping.platform_attribute}
                      onChange={(e) =>
                        updateMapping(
                          index,
                          "platform_attribute",
                          e.target.value
                        )
                      }
                      size="small"
                    />
                    <Select
                      value={mapping.source_type}
                      onValueChange={(value) =>
                        updateMapping(index, "source_type", value)
                      }
                      size="small"
                    >
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="attribute">Attribute</Select.Item>
                        <Select.Item value="custom">Custom</Select.Item>
                        <Select.Item value="static">Static</Select.Item>
                      </Select.Content>
                    </Select>
                    <Input
                      placeholder="Mapping Value"
                      value={mapping.mapping_value}
                      onChange={(e) =>
                        updateMapping(index, "mapping_value", e.target.value)
                      }
                      size="small"
                    />
                  </div>
                  <Button
                    size="small"
                    variant="transparent"
                    onClick={() => removeMapping(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FocusModal.Body>
      <FocusModal.Footer>
        <div className="flex items-center justify-end gap-2">
          <Button
            size="small"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={handleSubmit}
            isLoading={isPending}
            disabled={isPending}
          >
            {feedToEdit ? "Update Feed" : "Create Feed"}
          </Button>
        </div>
      </FocusModal.Footer>
    </FocusModal>
  )
}
