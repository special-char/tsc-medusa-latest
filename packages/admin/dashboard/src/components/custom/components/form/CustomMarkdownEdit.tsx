import { ControllerRenderProps, FieldValues } from "react-hook-form";
import ReactMarkdownEditor from "@uiw/react-markdown-editor";
import { forwardRef } from "react";

type CustomMarkdownEditProps = ControllerRenderProps<FieldValues, string>;

const CustomMarkdownEdit = forwardRef<JSX.Element, CustomMarkdownEditProps>(
	(props, ref) => {
		return (
			<div data-color-mode="light">
				<ReactMarkdownEditor
					value={props.value ?? ""}
					height="200px"
					onChange={(value, viewUpdate) => {
						if (value !== "") {
							props?.onChange(value);
						} else {
							props.onChange(value);
						}
					}}
				/>
			</div>
		);
	}
);

export default CustomMarkdownEdit;
