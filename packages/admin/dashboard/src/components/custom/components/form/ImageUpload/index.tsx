import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { ArrowUpCircleSolid, XMark } from "@medusajs/icons";

interface UploadedImage {
	id: string;
	url: string;
	file: File; // Added for consistency if needed later
}

interface ImageUploadProps {
	onChange: (images: UploadedImage[] | UploadedImage | null) => void;
	value: UploadedImage[] | UploadedImage | null;
	multiple?: boolean;
}

const ImageComponent = ({
	image,
	removeImage,
}: {
	image: UploadedImage;
	removeImage: (id: string) => void;
}) => {
	return (
		<div
			key={image.id}
			className="relative shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]"
		>
			<img src={image.url} alt="thumbnail" className="size-full object-cover" />
			<button
				onClick={() => removeImage(image.id)}
				type="button"
				className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
			>
				<XMark />
			</button>
		</div>
	);
};

const RenderImages = ({
	multiple,
	value,
	removeImage,
}: {
	multiple: boolean;
	value: UploadedImage | UploadedImage[] | null;
	removeImage: (id: string) => void;
}) => {
	if (multiple && Array.isArray(value)) {
		return value.map((image) => (
			<ImageComponent image={image} removeImage={removeImage} key={image.id} />
		));
	} else if (value && !Array.isArray(value)) {
		return <ImageComponent image={value} removeImage={removeImage} />;
	}
	return null;
};

const ImageUpload = ({
	onChange,
	value,
	multiple = true,
}: ImageUploadProps) => {
	const [inputKey, setInputKey] = useState<number>(0);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const files = Array.from(e.dataTransfer.files);
			handleChange(files);
		},
		[onChange, value, multiple]
	);

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files || []);
			handleChange(files);
		},
		[onChange, value, multiple]
	);

	const handleChange = useCallback(
		(files: File[]) => {
			const newImages = files.map((file) => ({
				id: Math.random().toString(36).substring(7),
				file,
				url: URL.createObjectURL(file),
			}));
			if (multiple) {
				if (newImages?.length) {
					const existingImages = Array.isArray(value)
						? value
						: value
						? [value]
						: [];
					onChange([...existingImages, ...newImages]);
				}
			} else {
				if (newImages[0]) onChange(newImages[0]);
			}
			setInputKey((prevKey) => prevKey + 1);
		},
		[onChange, value, multiple]
	);

	const removeImage = useCallback(
		(id: string) => {
			if (multiple && Array.isArray(value)) {
				const updatedImages = value.filter((img) => img.id !== id);
				onChange(updatedImages);
			} else {
				onChange(null); // For single image, reset to null
			}
		},
		[onChange, value, multiple]
	);

	return (
		<div>
			<label
				className="h-full p-8 bg-ui-bg-component border-ui-border-strong transition-fg group flex w-full items-center justify-center gap-y-2 rounded-lg border border-dashed hover:border-ui-border-interactive focus:border-ui-border-interactive focus:shadow-borders-focus outline-none focus:border-solid cursor-pointer"
				onDragOver={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onDrop={handleDrop}
			>
				<span className="flex flex-col items-center justify-center gap-2">
					<span className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50">
						<ArrowUpCircleSolid />
						<span>Upload</span>
						<input
							key={inputKey}
							type="file"
							id="multiple-upload"
							className="hidden"
							onChange={handleFileChange}
							accept="image/jpeg,image/jpg,image/png,image/webp"
							multiple={multiple}
						/>
					</span>
					<p className="text-gray-600 text-center">
						Choose images or drag & drop them here.
						<br />
						JPG, JPEG, PNG, and WEBP. Max 20 MB.
					</p>
				</span>
			</label>
			<div className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] gap-4 py-2">
				<RenderImages
					multiple={multiple}
					removeImage={removeImage}
					value={value}
				/>
			</div>
		</div>
	);
};

export default ImageUpload;
