import React, { useMemo } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

interface RichTextProps {
  value: string
  onChange: (content: string) => void
}

const RichTextInput: React.FC<RichTextProps> = ({
  value,
  onChange,
  ...props
}) => {
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
          ["link"],
          ["blockquote"],
        ],
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
    "blockquote",
    "code-block",
  ]

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={richTextModules}
      formats={richTextFormats}
    />
  )
}

export default RichTextInput
