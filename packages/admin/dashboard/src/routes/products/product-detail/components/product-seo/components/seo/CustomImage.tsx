const CustomImage = ({ src }: { src: string }) => {
	return (
		<span className="overflow-hidden">
			<img
				src={src}
				className="w-full aspect-video object-contain border rounded-md"
			/>
		</span>
	);
};

export default CustomImage;
