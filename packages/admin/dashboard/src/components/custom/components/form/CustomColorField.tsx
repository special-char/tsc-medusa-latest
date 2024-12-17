import { IconButton } from "@medusajs/ui";
import { XMark } from "@medusajs/icons";

type Props = {
	options: {
		label: string;
		value: string;
	}[];
	name: string;
	placeholder?: string;
	value: string;
	onChange: (e: any) => void;
};

const CustomColorField = ({ name, value, onChange }: Props) => {
	return (
		<div className="flex gap-2 items-center">
			<label
				className="border relative transition-fg relative inline-flex items-center justify-center overflow-hidden rounded-md outline-none disabled:bg-ui-bg-disabled disabled:shadow-buttons-neutral disabled:text-ui-fg-disabled disabled:after:hidden h-8 w-16"
				style={{
					background:
						value && value != ""
							? value
							: "linear-gradient(22.5deg, white 48%, red 48%, red 52%, white 52%)",
				}}
			>
				<input
					name={name}
					type="color"
					value={value || ""}
					onChange={onChange}
					className="invisible w-full h-full"
				/>
			</label>
			<IconButton type="button" onClick={() => onChange(null)}>
				<XMark />
			</IconButton>
		</div>
	);
};

export default CustomColorField;
