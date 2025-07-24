import { AdminProductVariant } from "@medusajs/framework/types";

export type FreeProductsDTO = {
	id: string;
	title: string;
	region_id: string;
	product_id: string;
	variant_id: string;
	min_price: number;
	max_price: number;
	metadata?: Record<string, any>;
	product_variant?: AdminProductVariant;
};
