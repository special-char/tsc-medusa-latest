import { Input, Textarea, Checkbox } from "@medusajs/ui"
import CustomMarkdownEdit from "./CustomMarkdownEdit"
import CustomToggleButton from "./CustomToggleButton"
import CustomSelect from "./CustomSelect"
import CustomColorField from "./CustomColorField"
import ImageUpload from "./ImageUpload"
import AddDenomination from "./AddDenomination"
import SelectSalesChannel from "./SelectSalesChannel"
import CustomCombobox from "./CustomCombobox"
import CustomRichTextInput from "./CustomRichTextInput"
import CustomMetaData from "./CustomMetaData"
import NestedMultiSelect from "./CustomNestedMultiSelect"
import SocialFieldArray from "../../../../routes/products/product-detail/components/product-seo/components/seo/SocialFieldArray"
import SeoFileUploadField from "../../../../routes/products/product-detail/components/product-seo/components/form/FileUploadField"
import FileUploadField from "./FileUploadField"
import CustomSearchableSelect from "./CustomSearchableSelect"
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
      return CustomRichTextInput
    case "combobox":
      return CustomCombobox
    case "searchable-select":
      return CustomSearchableSelect
    case "nested-select":
      return NestedMultiSelect
    case "metadata":
      return CustomMetaData
    case "toggle":
      return CustomToggleButton
    case "file-upload":
      return FileUploadField
    case "select":
      return CustomSelect
    case "image-upload":
      return ImageUpload
    case "color-picker":
      return CustomColorField
    case "add-denomination":
      return AddDenomination
    case "SalesChannel":
      return SelectSalesChannel
    case "socialfieldArray":
      return SocialFieldArray
    case "seo-file-upload":
      return SeoFileUploadField
    default:
      return Input
  }
}

export default getInputElement
