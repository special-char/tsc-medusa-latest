"use client"

import { Spinner } from "@medusajs/icons"
import { AdminOrderLineItem } from "@medusajs/types"
import { Button, Prompt } from "@medusajs/ui"
import html2canvas from "html2canvas"
import { useRef, useState } from "react"
import { QRCode } from "react-qrcode-logo"
import Logo from "../../../../../assets/images/lisco-logo.jpg"

export default function QRCodeGenerate({ item }: { item: AdminOrderLineItem }) {
  const exportDivImageRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const value = `${__STOREFRONT_URL__}/warrenty/${item.variant_id}/${item.id}`

  const exportAsImage = async (
    element: HTMLElement | null,
    imageFileName: string
  ) => {
    if (!element) return

    setDownloading(true)
    try {
      const canvas = await html2canvas(element, {
        allowTaint: true,
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        x: 0,
        y: 0,
        width: element.offsetWidth,
        height: element.offsetHeight,
        backgroundColor: null,
      })

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setDownloading(false)
            console.error("Failed to create blob from canvas")
            return
          }

          const url = URL.createObjectURL(blob)
          downloadImage(url, imageFileName)
        },
        "image/jpeg",
        1.0
      )
    } catch (error) {
      setDownloading(false)
      console.error("Error generating image:", error)
    }
  }

  const downloadImage = (url: string, fileName: string) => {
    try {
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading image:", error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Prompt variant="confirmation">
      <Prompt.Trigger asChild>
        <Button size="small" className="flex items-center gap-2">
          QRCode
        </Button>
      </Prompt.Trigger>
      <Prompt.Content>
        <Prompt.Header className="flex flex-col gap-4">
          <Prompt.Title>QRCode</Prompt.Title>
          <div
            className="flex flex-col items-center gap-4 rounded-xl bg-white p-6 shadow-md"
            ref={exportDivImageRef}
          >
            <QRCode
              value={value}
              logoImage={Logo}
              qrStyle="dots"
              fgColor="#AA051F"
              size={200}
            />
          </div>
        </Prompt.Header>
        <Prompt.Footer>
          <Prompt.Cancel>Cancel</Prompt.Cancel>
          <Prompt.Action
            onClick={() =>
              exportAsImage(
                exportDivImageRef.current,
                `${item.product_title}-${item.variant_title}.jpeg`
              )
            }
            disabled={downloading}
          >
            {downloading ? (
              <Spinner className="animate-spin" />
            ) : (
              "Download QRCode"
            )}
          </Prompt.Action>
        </Prompt.Footer>
      </Prompt.Content>
    </Prompt>
  )
}
