import { Input, Textarea, Checkbox } from "@medusajs/ui"
import CustomMarkdownEdit from "./CustomMarkdownEdit"
import CustomToggleButton from "./CustomToggleButton"
import FileUploadField from "./FileUploadField"
import CustomSelect from "./CustomSelect"
import CustomColorField from "./CustomColorField"
import ImageUpload from "./ImageUpload"
import AddDenomination from "./AddDenomination"
import SelectSalesChannel from "./SelectSalesChannel"
import RichTextInput from "../../../../routes/faqs/components/rich-text-input"

type InputElementType = React.ComponentType<any>

const getInputElement = (type: string): InputElementType => {
  switch (type) {
    case "input":
      return Input
    case "textarea":
      return Textarea
    case "checkbox":
      return Checkbox
    case "markdown-editor":
      return CustomMarkdownEdit
    case "richText-editor":
      return RichTextInput
    case "toggle":
      return CustomToggleButton
    case "file-upload":
      return FileUploadField
    case "image-upload":
      return ImageUpload
    case "select":
      return CustomSelect
    case "color-picker":
      return CustomColorField
    case "add-denomination":
      return AddDenomination
    case "SalesChannel":
      return SelectSalesChannel
    default:
      return Input
  }
}

export default getInputElement
