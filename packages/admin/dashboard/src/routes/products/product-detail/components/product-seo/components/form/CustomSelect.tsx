import { Select, IconButton } from "@medusajs/ui";
import { XMark } from "@medusajs/icons";

type Props = {
	options: {
		label: string;
		value: string;
	}[];
	placeholder?: string;
	value: string;
	onChange: (e: any) => void;
};

const CustomSelect = ({ options, placeholder, value, onChange }: Props) => {
	return (
		<div className="w-[256px] flex gap-2 items-center relative">
			<Select
				value={value}
				defaultValue={value}
				onValueChange={(value) => onChange(value)}
			>
				<Select.Trigger>
					<Select.Value placeholder={placeholder ?? "Select"} />
				</Select.Trigger>
				<Select.Content>
					{options.map((item) => (
						<Select.Item key={item.value} value={item.value}>
							{item.label}
						</Select.Item>
					))}
				</Select.Content>
			</Select>
			<IconButton type="button" onClick={() => onChange(null)}>
				<XMark />
			</IconButton>
		</div>
	);
};

export default CustomSelect;
