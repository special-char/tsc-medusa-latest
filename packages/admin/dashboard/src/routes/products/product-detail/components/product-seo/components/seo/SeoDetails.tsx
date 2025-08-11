import { Heading, Text } from "@medusajs/ui"
import { SeoDetailsTypes } from "../.."
import CustomImage from "./CustomImage"
import { PropsWithChildren } from "react"

const CommonCell = ({
  children,
  label,
}: PropsWithChildren & { label: string }) => {
  return (
    <div className="grid grid-cols-2 gap-4 px-6 py-4">
      <Text
        size="small"
        leading="compact"
        weight="plus"
        className="text-ui-fg-base"
      >
        {label}
      </Text>
      {children}
    </div>
  )
}
const Cell = ({ label, value }: { label: string; value?: string | null }) => {
  return (
    <CommonCell label={label}>
      <Text size="small">{value || "-"}</Text>
    </CommonCell>
  )
}
const ImageCell = ({ label, url }: { label: string; url?: string | null }) => {
  return (
    <CommonCell label={label}>
      {url && url !== "null" ? (
        <CustomImage src={url} />
      ) : (
        <Text size="small">-</Text>
      )}
    </CommonCell>
  )
}
const LinkCell = ({ label, url }: { label: string; url?: string | null }) => {
  return (
    <CommonCell label={label}>
      {url ? (
        <a
          target="_blank"
          href={url}
          className="txt-compact-small whitespace-pre-line  text-pretty font-sans font-normal text-blue-500 underline"
          rel="noreferrer"
        >
          {url}
        </a>
      ) : (
        <Text size="small">-</Text>
      )}
    </CommonCell>
  )
}
const JsonCell = ({
  label,
  value,
}: {
  label: string
  value?: Record<string, any> | null
}) => {
  return (
    <CommonCell label={label}>
      {value ? (
        <pre className="txt-compact-small whitespace-pre-line text-pretty font-sans font-normal">
          {JSON.stringify(value, null, 2)}
        </pre>
      ) : (
        <Text size="small">-</Text>
      )}
    </CommonCell>
  )
}

const SeoDetails = ({ productSeo }: { productSeo: SeoDetailsTypes }) => {
  return (
    <div className="divide-y">
      <Cell label="Name" value={productSeo?.metaTitle} />
      <Cell
        label="Desc"
        value={
          productSeo?.metaDescription && productSeo.metaDescription.length > 10
            ? productSeo.metaDescription.slice(0, 20) + "..."
            : productSeo?.metaDescription
        }
      />
      <ImageCell label="Image" url={productSeo?.metaImage} />
      <Cell
        label="Keywords"
        value={
          productSeo?.keywords && productSeo.keywords.length > 15
            ? productSeo.keywords.slice(0, 15) + "..."
            : productSeo?.keywords
        }
      />
      <Cell
        label="Robots"
        value={
          productSeo?.metaRobots && productSeo.metaRobots.length > 15
            ? productSeo.metaRobots.slice(0, 15) + "..."
            : productSeo?.metaRobots
        }
      />
      <JsonCell label="Structured Data" value={productSeo?.structuredData} />
      <JsonCell label="Feed Data" value={productSeo?.feedData} />
      <Cell label="Viewport" value={productSeo?.metaViewport} />
      <LinkCell label="Canonical URL" url={productSeo?.canonicalURL} />
      {productSeo?.metaSocial?.length > 0 && (
        <>
          <Heading level="h3">Product Seo Social</Heading>
          <div className="divide-y rounded-md border p-4">
            {productSeo?.metaSocial.map((item) => {
              return (
                <div className="overflow-auto py-2" key={item.id}>
                  <Cell label="Network" value={item.socialNetwork} />
                  <Cell label="Name" value={item.title} />
                  <Cell label="Description" value={item.description} />
                  <ImageCell label="Image" url={item.image} />
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default SeoDetails
