import React, { useState } from "react";
import { useController, Control } from "react-hook-form";
import { ArchiveBox, ArrowUpTray } from "@medusajs/icons";
import { Label } from "@medusajs/ui";

interface FileInputProps {
	name: string;
	control: Control<any>;
	rules?: Record<string, any>;
	title?: string;
}

const FileInput: React.FC<FileInputProps> = ({
	name,
	control,
	rules,
	title,
}) => {
	const { field, fieldState } = useController({
		name,
		control,
		rules,
	});

	const [fileContent, setFileContent] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type === "text/csv") {
			const reader = new FileReader();
			reader.onload = (event) => {
				if (event.target?.result) {
					setFileContent(event.target.result as string);
					field.onChange(file);
				}
			};
			reader.readAsText(file);
		} else {
			setFileContent(null);
			field.onChange(null);
		}
	};

	return (
		<div className="mb-4">
			<Label
				htmlFor={name}
				className="relative grid place-items-center text-sm font-medium text-gray-700 w-[300px] aspect-[3/2] border-2 border-dashed"
			>
				<div className="flex flex-col items-center justify-center gap-8">
					{field.value ? (
						<>
							<ArchiveBox />
							<p>File uploaded</p>
						</>
					) : (
						<>
							{title}
							<ArrowUpTray />
							<p>Drag and Drop CSV file to upload</p>
						</>
					)}
				</div>
				<input
					id={name}
					type="file"
					accept=".csv"
					onChange={handleFileChange}
					className="absolute top-0 left-0 w-full h-full opacity-0 z-10"
				/>
			</Label>
			{fieldState.error && (
				<p className="mt-2 text-sm text-red-600">{fieldState.error.message}</p>
			)}
			{/* {fileContent && (
				<div className="mt-4">
					<h4 className="text-lg font-medium text-gray-900">File Preview:</h4>
					<pre className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded-md overflow-x-auto">
						{fileContent}
					</pre>
				</div>
			)} */}
		</div>
	);
};

export default FileInput;
