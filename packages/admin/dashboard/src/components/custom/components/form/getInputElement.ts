import { Input, Textarea, Checkbox } from "@medusajs/ui";
import CustomMarkdownEdit from "./CustomMarkdownEdit";
import CustomToggleButton from "./CustomToggleButton";
import FileUploadField from "./FileUploadField";
import CustomSelect from "./CustomSelect";
import CustomColorField from "./CustomColorField";
import ImageUpload from "./ImageUpload";

type InputElementType = React.ComponentType<any>;

const getInputElement = (type: string): InputElementType => {
	switch (type) {
		case "input":
			return Input;
		case "textarea":
			return Textarea;
		case "checkbox":
			return Checkbox;
		case "markdown-editor":
			return CustomMarkdownEdit;
		case "toggle":
			return CustomToggleButton;
		case "file-upload":
			return FileUploadField;
		case "image-upload":
			return ImageUpload;
		case "select":
			return CustomSelect;
		case "color-picker":
			return CustomColorField;
		default:
			return Input;
	}
};

export default getInputElement;
