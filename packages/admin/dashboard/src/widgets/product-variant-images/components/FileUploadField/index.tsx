import clsx from "clsx"
import React, { useRef, useState, useEffect } from "react"
import { XMark, Trash } from "@medusajs/icons"

type FileUploadFieldProps = {
  onChange: (files: File[]) => void
  value: File[] | string
  filetypes: string[]
  errorMessage?: string
  placeholder?: React.ReactElement | string
  className?: string
  multiple?: boolean
  text?: React.ReactElement | string
  preview?: boolean
}

const defaultText = (
  <span>
    Drop your images here, or{" "}
    <span className="text-violet-60">click to browse</span>
  </span>
)

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  onChange,
  value,
  filetypes,
  errorMessage,
  className,
  text = defaultText,
  placeholder = "",
  multiple = false,
  preview = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileUploadError, setFileUploadError] = useState(false)
  // const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string[]>([])

  useEffect(() => {
    if (value && Array.isArray(value) && value.length > 0) {
      const fileReaders: FileReader[] = []
      const images: string[] = []

      value.forEach((file, index) => {
        const reader = new FileReader()
        fileReaders.push(reader)

        reader.onloadend = () => {
          if (reader.result) {
            images[index] = reader.result as string
            if (images.length === value.length) {
              setSelectedImage([...images])
            }
          }
        }

        reader.readAsDataURL(file)
      })

      // Cleanup: Abort any remaining readers if needed
      return () => fileReaders.forEach((reader) => reader.abort())
    } else {
      setSelectedImage([])
      setFileUploadError(false)
    }
  }, [value])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files

    if (fileList) {
      const filesArray = Array.from(fileList)
      onChange(filesArray) // Pass files to parent component
      setFileUploadError(false)

      const readers: FileReader[] = []
      const images: string[] = []

      filesArray.forEach((file, index) => {
        const reader = new FileReader()
        readers.push(reader)

        reader.onloadend = () => {
          if (reader.result) {
            images[index] = reader.result as string
            if (images.length === filesArray.length) {
              setSelectedImage([...images])
            }
          }
        }

        reader.readAsDataURL(file)
      })

      // Cleanup FileReaders on unmount or input change
      return () => readers.forEach((reader) => reader.abort())
    }
  }

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setFileUploadError(false)

    const files: File[] = []
    const readers: FileReader[] = []
    const images: string[] = []

    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i]
        if (item.kind === "file") {
          const file = item.getAsFile()
          if (file && filetypes.indexOf(file.type) > -1) {
            files.push(file)
          }
        }
      }
    } else {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i]
        if (filetypes.indexOf(file.type) > -1) {
          files.push(file)
        }
      }
    }

    if (files.length > 0) {
      onChange(files) // Pass files to parent component

      files.forEach((file, index) => {
        const reader = new FileReader()
        readers.push(reader)

        reader.onloadend = () => {
          if (reader.result) {
            images[index] = reader.result as string
            if (images.length === files.length) {
              setSelectedImage([...images])
            }
          }
        }

        reader.readAsDataURL(file)
      })

      // Cleanup FileReaders on unmount or drop change
      return () => readers.forEach((reader) => reader.abort())
    } else {
      setFileUploadError(true)
    }
  }

  return (
    <>
      <div className="flex h-[200px] items-center gap-8">
        {preview && !multiple && (
          <>
            {value && typeof value === "string" ? (
              <div className="border-ui-border-strong relative flex aspect-[3/4] h-full items-center justify-center rounded-lg border border-dashed p-2">
                <img
                  src={value}
                  alt="Selected"
                  className="object-container h-full w-auto max-w-48 rounded"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage([])
                    onChange([])
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white focus:outline-none"
                >
                  <Trash className="text-white" />
                </button>
              </div>
            ) : (
              <div className="border-ui-border-strong relative flex aspect-[3/4] h-full items-center justify-center rounded-lg border border-dashed p-2">
                <p className="text-center">No any Image Uploaded</p>
              </div>
            )}
          </>
        )}
        <div
          onClick={() => inputRef?.current?.click()}
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
          className={clsx(
            "bg-ui-bg-component border-ui-border-strong transition-fg hover:border-ui-border-interactive focus:border-ui-border-interactive focus:shadow-borders-focus group flex h-full w-full cursor-pointer items-center justify-center gap-y-2 rounded-lg border border-dashed px-8 py-4 outline-none focus:border-solid",
            className
          )}
        >
          {preview && !multiple && selectedImage.length > 0 ? (
            selectedImage?.map((item) => (
              <div key={item} className="relative h-full">
                <img
                  src={item}
                  alt="Selected"
                  className="object-container h-full w-full max-w-48 rounded"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage([])
                    onChange([])
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white focus:outline-none"
                >
                  <XMark className="text-white" />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center">
              <p>{text}</p>
              {placeholder}
            </div>
          )}
          {fileUploadError && (
            <span className="text-rose-60">
              {errorMessage || "Please upload an image file"}
            </span>
          )}
          <input
            ref={inputRef}
            accept={filetypes.join(", ")}
            multiple={multiple}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </>
  )
}

export default FileUploadField
