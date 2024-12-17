export type FormImage = {
	url: string;
	name?: string;
	size?: number;
	nativeFile?: File;
};

export type ImageType = { selected: boolean } & FormImage;

export type MediaFormType = {
	images: ImageType[];
};

export type MediaFormWrapper = {
	media: MediaFormType;
};
