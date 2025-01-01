import { Input, Textarea } from "@medusajs/ui"

import FileUploadField from "./FileUploadField"
import CustomSelect from "./CustomSelect"
import SocialFieldArray from "../seo/SocialFieldArray"

type InputElementType = React.ComponentType<any>

const getInputElement = (type: string): InputElementType => {
  switch (type) {
    case "input":
      return Input
    case "textarea":
      return Textarea
    case "file-upload":
      return FileUploadField
    case "select":
      return CustomSelect
    case "fieldArray":
      return SocialFieldArray
    default:
      return Input
  }
}

export default getInputElement
