import clsx from "clsx"
import React, { useRef, useState, useEffect } from "react"
import { ArrowUpCircleSolid, XMark, Trash } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"
type FileUploadFieldProps = {
  onChange: (files: File[] | null) => void
  value: File[] | string
  filetypes: string[]
  errorMessage?: string
  placeholder?: React.ReactElement | string
  className?: string
  multiple?: boolean
  text?: React.ReactElement | string
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
  errorMessage = "",
  text = defaultText,
  placeholder = "",
  multiple = false,
  className = "",
  // ...props
}) => {
  // return;
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (value && typeof value !== "string" && value.length > 0) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(value[0])
    } else {
      setSelectedImage(null)
      setFileUploadError(false)
    }
  }, [value, selectedImage])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files

    if (fileList) {
      const filesArray = Array.from(fileList)
      onChange(filesArray)

      if (filesArray.length > 0) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setSelectedImage(reader.result as string)
        }
        reader.readAsDataURL(filesArray[0])
      }
    }
  }

  const handleFileDrop = (
    e: React.DragEvent<HTMLDivElement | HTMLLabelElement>
  ) => {
    setFileUploadError(false)
    e.preventDefault()

    const files: File[] = []

    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile()
          if (file && filetypes.indexOf(file.type) > -1) {
            files.push(file)
          }
        }
      }
    } else {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        if (filetypes.indexOf(e.dataTransfer.files[i].type) > -1) {
          files.push(e.dataTransfer.files[i])
        }
      }
    }

    if (files.length > 0) {
      onChange(files)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(files[0])
    } else {
      setFileUploadError(true)
    }
  }

  return (
    <div className="flex h-[200px] items-center gap-8">
      {/* {value && typeof value === "string" && value !== "null" ? (
        <div className="relative h-full aspect-[3/4] flex items-center justify-center border-ui-border-strong rounded-lg border border-dashed p-2">
          <img
            src={value}
            alt="Selected"
            className="w-auto max-w-48 h-full object-container rounded"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
              onChange(null);
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 focus:outline-none"
          >
            <Trash className="text-white" />
          </button>
        </div>
      ) : (
        <div className="relative h-full aspect-[3/4] flex items-center justify-center border-ui-border-strong rounded-lg border border-dashed p-2">
          <p className="text-center">No any Image Uploaded</p>
        </div>
      )} */}
      <div
        onClick={() => inputRef?.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onDrop={handleFileDrop}
        className={clsx(
          "bg-ui-bg-component border-ui-border-strong transition-fg hover:border-ui-border-interactive focus:border-ui-border-interactive focus:shadow-borders-focus group flex h-full w-full cursor-pointer items-center justify-center gap-y-2 rounded-lg border border-dashed px-8 py-4 outline-none focus:border-solid",
          className
        )}
      >
        {selectedImage || (value && value !== "null") ? (
          <div className="relative h-full">
            <img
              src={selectedImage || value}
              alt="Selected"
              className="object-container h-full w-full max-w-48 rounded"
            />
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(null)
                onChange(null)
              }}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white focus:outline-none"
            >
              <XMark className="text-white" />
            </IconButton>
          </div>
        ) : (
          <label
          // onClick={() => inputRef?.current?.click()}
          // // className="h-full p-8 bg-ui-bg-component border-ui-border-strong transition-fg group flex w-full items-center justify-center gap-y-2 rounded-lg border border-dashed hover:border-ui-border-interactive focus:border-ui-border-interactive focus:shadow-borders-focus outline-none focus:border-solid cursor-pointer"
          // onDragOver={(e) => {
          //   e.preventDefault();
          //   e.stopPropagation();
          // }}
          // onDrop={handleFileDrop}
          >
            <span className="flex flex-col items-center justify-center gap-2">
              <span className="text-ui-contrast-fg-primary bg-ui-button-inverted flex cursor-pointer items-center gap-2 rounded-full px-4 py-2">
                <ArrowUpCircleSolid />
                <span>Upload</span>
              </span>
              <p className="text-center text-gray-600">
                Choose images or drag & drop them here.
                <br />
                JPG, JPEG, PNG, and WEBP. Max 20 MB.
              </p>
            </span>
          </label>
        )}
        {fileUploadError && (
          <span className="text-rose-60">
            {errorMessage || "Please upload an image file"}
          </span>
        )}
        <input
          ref={inputRef}
          accept={filetypes?.join(", ")}
          multiple={multiple}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}

export default FileUploadField
