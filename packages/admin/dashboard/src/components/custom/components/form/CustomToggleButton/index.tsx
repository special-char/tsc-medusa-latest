import { ControllerRenderProps, FieldValues } from "react-hook-form";
import "./style.css";
import { forwardRef } from "react";

const CustomToggleButton = forwardRef<
	HTMLInputElement,
	ControllerRenderProps<FieldValues, string>
>((props, ref) => {
	return (
		<label className="toggleBtn flex items-center gap-2 py-2">
			<span>OFF</span>
			<input
				ref={ref}
				type="checkbox"
				checked={props?.value}
				onChange={(val) => props.onChange(val)}
			/>
			<span>ON</span>
		</label>
	);
});

export default CustomToggleButton;
