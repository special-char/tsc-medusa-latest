import { Input, Textarea } from "@medusajs/ui"

import FileUploadField from "./FileUploadField"
import CustomSelect from "./CustomSelect"
import SocialFieldArray from "../seo/SocialFieldArray"
import JsonEditor from "../../../../../../../components/custom/components/form/JsonEditor"

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
    case "jsonEditor":
      return JsonEditor
    default:
      return Input
  }
}

export default getInputElement
