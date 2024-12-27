import { Textarea, Label } from "@medusajs/ui";
import { useController, UseControllerProps } from "react-hook-form";
import { clx } from "@medusajs/ui";

type Props = { title: string; className?: string } & UseControllerProps;

const CustomTextarea = ({
	control,
	name,
	title,
	rules,
	defaultValue,
	className,
}: Props) => {
	const {
		field,
		fieldState: { error },
	} = useController({
		name,
		control,
		rules,
		defaultValue,
	});

	return (
		<Label
			className={clx("space-y-2", {
				[`${className}`]: !!className,
			})}
		>
			<span
			// className={
			//   rules?.required ? "after:content-['*'] after:text-rose-60" : ""
			// }
			>
				{title} {rules?.required && <span className="text-red-500">*</span>}
			</span>
			<Textarea {...field} />
			{error && <p className="text-small text-rose-600">{error.message}</p>}
		</Label>
	);
};

export default CustomTextarea;
