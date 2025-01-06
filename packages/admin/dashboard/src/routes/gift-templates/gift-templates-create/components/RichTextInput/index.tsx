import React, { useMemo, useRef, useEffect, useState } from "react"
import ReactQuill, { Quill } from "react-quill"
import QuillResizeImage from "quill-resize-image"
import "react-quill/dist/quill.snow.css"
import { Label } from "@medusajs/ui"
import { sdk } from "../../../../../lib/client"

Quill.register("modules/resize", QuillResizeImage)

interface RichTextProps {
  label?: string
  value: string
  onChange: (content: string) => void
}

const RichTextInput: React.FC<RichTextProps> = ({ label, value, onChange }) => {
  //   const uploadFile = useAdminUploadFile();
  //   const deleteFile = useAdminDeleteFile();
  const quillRef = useRef<ReactQuill>(null)

  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const imageHandler = () => {
    const input = document.createElement("input")

    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.click()

    input.onchange = async () => {
      const file: File | null = input.files ? input.files[0] : null
      if (!file) return

      const quill = quillRef.current?.getEditor()
      const range = quill?.getSelection()

      if (quill && range) {
        // Insert a temporary placeholder image while uploading
        const placeholderId = `uploading-${Date.now()}`
        quill.insertEmbed(range.index, "image", placeholderId)

        const reader = new FileReader()
        reader.onload = async () => {
          const img = new Image()
          img.src = reader.result as string

          img.onload = async () => {
            // Resize the image using a canvas
            const canvas = document.createElement("canvas")
            const maxWidth = 800 // Maximum width
            const maxHeight = 600 // Maximum height

            let width = img.width
            let height = img.height

            if (width > maxWidth || height > maxHeight) {
              if (width > height) {
                height = (height * maxWidth) / width
                width = maxWidth
              } else {
                width = (width * maxHeight) / height
                height = maxHeight
              }
            }

            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext("2d")
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height)

              const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7) // Compress to 70% quality
              const range = quill?.getSelection()

              // Replace placeholder with resized image while uploading
              const imgTags = quill.root.querySelectorAll(
                `img[src="${placeholderId}"]`
              )
              imgTags.forEach((img: any) => {
                img.src = resizedBase64
              })

              try {
                const response = await sdk.admin.upload.create({
                  files: [file],
                })

                const uploadedImage = response.files?.[0]
                if (uploadedImage && uploadedImage.url) {
                  const uploadedImageUrl = uploadedImage.url

                  // Replace the placeholder with the final server URL
                  imgTags.forEach((img: any) => {
                    img.src = uploadedImageUrl
                  })

                  // Add the uploaded image URL to state
                  setUploadedImages((prev) => [...prev, uploadedImageUrl])
                }
              } catch (error) {
                console.error("Image upload failed:", error)

                // Remove the placeholder if upload fails
                imgTags.forEach((img) => {
                  img.remove()
                })
              }
            }
          }
        }

        reader.readAsDataURL(file)
      }
    }
  }

  const handleImageDeletion = (remainingImages: string[]) => {
    const deletedImages = uploadedImages.filter(
      (url) => !remainingImages.includes(url)
    )

    // deletedImages.forEach((imageUrl) => {
    //   const fileKey = extractFileKeyFromUrl(imageUrl);

    //   deleteFile.mutate(
    //     { file_key: fileKey },
    //     {
    //       onSuccess: () => {
    //         console.log(`Deleted image: ${fileKey}`);
    //       },
    //       onError: (error) => {
    //         console.error(`Failed to delete image: ${fileKey}`, error);
    //       },
    //     }
    //   );
    // });

    // Update the tracked images
    setUploadedImages(remainingImages)
  }

  // Monitor editor content changes
  const handleTextChange = () => {
    const quillObj = quillRef.current?.getEditor()
    if (!quillObj) return

    console.log("quillObj", quillObj)

    const currentImages = Array.from(quillObj.root.querySelectorAll("img")).map(
      (img: HTMLImageElement) => img.src
    )
    console.log("currentImages", currentImages)

    handleImageDeletion(currentImages)
  }

  useEffect(() => {
    const quillObj = quillRef.current?.getEditor()
    quillObj?.on("text-change", handleTextChange)
    return () => {
      quillObj?.off("text-change", handleTextChange)
    }
  }, [uploadedImages])

  const richTextModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ font: [] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image"],
          ["blockquote"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      resize: {
        locale: {},
      },
      clipboard: { matchVisual: false },
      history: {
        delay: 2000,
        maxStack: 500,
      },
    }),
    []
  )

  const richTextFormats = [
    "font",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "blockquote",
    "code-block",
  ]

  const extractFileKeyFromUrl = (url: string) => {
    const decodedUrl = decodeURIComponent(url)
    return decodedUrl.split("/").pop()
  }

  return (
    <div>
      {label && <Label>{label}</Label>}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={richTextModules}
        formats={richTextFormats}
      />
    </div>
  )
}

export default RichTextInput
