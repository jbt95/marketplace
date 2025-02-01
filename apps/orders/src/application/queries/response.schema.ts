import { z } from 'zod';

export const orderResponseSchema = z
	.object({
		id: z.string(),
		price: z.number(),
		quantity: z.number(),
		product_id: z.string(),
		customer_id: z.string(),
		seller_id: z.string(),
		created_at: z.string(),
		updated_at: z.string().optional()
	})
	.optional();

export const orderListResponseSchema = z.object({
	items: z.array(orderResponseSchema).default([])
});

export type OrderResponse = z.infer<typeof orderResponseSchema>;
export type OrderListResponse = z.infer<typeof orderListResponseSchema>;
