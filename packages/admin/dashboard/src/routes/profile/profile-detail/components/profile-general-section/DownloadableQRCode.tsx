import { PropsWithChildren, useRef, useState } from "react"
import html2canvas from "html2canvas"
import { Button, Tooltip } from "@medusajs/ui"
import { ArrowDownTray } from "@medusajs/icons"
type Props = {
  name: string
} & PropsWithChildren
const DownloadableQRCode = ({ children, name }: Props) => {
  const exportDivImageRef = useRef()
  const [downloading, setDownloading] = useState(false)

  const exportAsImage = async (element: HTMLElement, imageFileName: string) => {
    setDownloading(true)
    try {
      const canvas = await html2canvas(element, {
        allowTaint: true,
        useCORS: true,
        scrollX: 0, // Prevent horizontal scroll clipping
        scrollY: -window.scrollY, // Account for vertical offset
        x: 0, // Set the x offset for rendering
        y: 0, // Set the y offset for rendering
        width: element.offsetWidth, // Ensure full width is captured
        height: element.offsetHeight, // Ensure full height is captured
        backgroundColor: null, // Transparent background if needed
        // scale: 3, // Increase the scale for higher resolution (optional)
      })
      const image = canvas.toDataURL("image/jpeg", 1.0)
      downloadImage(image, imageFileName)
    } catch (error) {
      setDownloading(false)
      console.error("Error generating image:", error)
    }
  }

  const downloadImage = (blob: string, fileName: string) => {
    try {
      const fakeLink = window.document.createElement("a")
      fakeLink.className = "sr-only"
      fakeLink.download = fileName
      fakeLink.href = blob
      document.body.appendChild(fakeLink)
      fakeLink.click()
      document.body.removeChild(fakeLink)
      fakeLink.remove()
      setDownloading(false)
    } catch (error) {
      setDownloading(false)
      console.error("Error downloading image:", error)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-start justify-center">
      <div ref={exportDivImageRef} className="rounded-sm bg-white p-2">
        {children}
      </div>
      <Tooltip content="Download Qr">
        <Button
          className="ml-2 mt-2 w-[200px]"
          onClick={() =>
            exportAsImage(exportDivImageRef?.current, `${name}.jpeg`)
          }
          disabled={downloading}
        >
          Download Qr <ArrowDownTray />
        </Button>
      </Tooltip>
    </div>
  )
}

export default DownloadableQRCode
