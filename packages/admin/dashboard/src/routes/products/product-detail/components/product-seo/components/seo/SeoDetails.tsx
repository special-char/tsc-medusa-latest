import { SeoDetailsTypes } from "../.."
import CustomImage from "./CustomImage"

const SeoDetails = ({ productSeo }: { productSeo: SeoDetailsTypes }) => {
  return (
    <div className="overflow-scroll rounded-md border p-4">
      <p className="grid grid-cols-[1fr_1fr] gap-4">
        <span className="font-bold">Name:</span>
        <span className="inter-base-regular text-grey-50">
          {productSeo?.metaTitle}
        </span>
      </p>
      <p className="grid grid-cols-[1fr_1fr] gap-4">
        <span className="font-bold">Desc:</span>
        <span className="inter-base-regular text-grey-50">
          {productSeo?.metaDescription && productSeo.metaDescription.length > 10
            ? productSeo.metaDescription.slice(0, 10) + "..."
            : productSeo?.metaDescription}
        </span>
      </p>
      <p className="grid grid-cols-[1fr_1fr] gap-4">
        <span className="font-bold">Image:</span>
        {productSeo?.metaImage && productSeo?.metaImage !== "null" && (
          <CustomImage src={productSeo?.metaImage} />
        )}
      </p>
      <p className="grid grid-cols-[1fr_1fr] gap-4">
        <span className="font-bold">Keywords:</span>
        <span className="inter-base-regular text-grey-50">
          {productSeo?.keywords && productSeo.keywords.length > 15
            ? productSeo.keywords.slice(0, 15) + "..."
            : productSeo?.keywords}
        </span>
      </p>
      <p className="grid grid-cols-[1fr_1fr] gap-4">
        <span className="font-bold">Robots:</span>
        <span className="inter-base-regular text-grey-50">
          {productSeo?.metaRobots && productSeo.metaRobots.length > 15
            ? productSeo.metaRobots.slice(0, 15) + "..."
            : productSeo?.metaRobots}
        </span>
      </p>
      <p className="grid grid-cols-[1fr_1fr] gap-4">
        <span className="font-bold">Structured Data:</span>
        <pre className="inter-base-regular text-grey-50">
          {JSON.stringify(productSeo?.structuredData, null, 2)}
        </pre>
      </p>
      <p className="grid grid-cols-[1fr_1fr] gap-4">
        <span className="font-bold">Feed Data:</span>
        <pre className="inter-base-regular text-grey-50">
          {JSON.stringify(productSeo?.feedData, null, 2)}
        </pre>
      </p>
      <p className="grid grid-cols-[1fr_1fr] gap-4">
        <span className="font-bold">Viewport:</span>
        <span className="inter-base-regular text-grey-50">
          {productSeo?.metaViewport}
        </span>
      </p>
      <p className="grid grid-cols-[1fr_1fr] gap-4">
        <span className="font-bold">Canonical URL:</span>
        <a
          target="_blank"
          href={productSeo?.canonicalURL ?? "#"}
          className="inter-base-regular text-blue-500 underline"
          rel="noreferrer"
        >
          {productSeo?.canonicalURL}
        </a>
      </p>
      {productSeo?.metaSocial?.length > 0 && (
        <>
          <p className="text-large my-4 font-bold">Product Seo Social</p>
          <div className="divide-y rounded-md border p-4">
            {productSeo?.metaSocial.map((item) => {
              return (
                <div className="overflow-auto py-2" key={item.id}>
                  <p className="grid grid-cols-[1fr_1fr] gap-4">
                    <span className="font-bold">Network</span>
                    <span className="inter-base-regular text-grey-50">
                      {item.socialNetwork}
                    </span>
                  </p>
                  <p className="grid grid-cols-[1fr_1fr] gap-4">
                    <span className="font-bold">Name</span>
                    <span className="inter-base-regular text-grey-50">
                      {item.title}
                    </span>
                  </p>
                  <p className="grid grid-cols-[1fr_1fr] gap-4">
                    <span className="font-bold">Description</span>
                    <span className="inter-base-regular text-grey-50">
                      {item.description}
                    </span>
                  </p>
                  <p className="grid grid-cols-[1fr_1fr] gap-4">
                    <span className="font-bold">Image</span>
                    {item.image && <CustomImage src={item.image} />}
                  </p>
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
