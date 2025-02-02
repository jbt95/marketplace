import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

const PriceSchema = z.number().min(1).openapi({
	description: 'The order price',
	example: 100,
	minimum: 1
});

const QuantitySchema = z.number().min(1).openapi({
	description: 'The quantity of items',
	example: 100,
	minimum: 1
});

const CreateOrderBodySchema = z
	.object({
		id: z.string().uuid().openapi({
			description: 'The order id',
			example: '123e4567-e89b-12d3-a456-426655440000'
		}),
		price: PriceSchema,
		quantity: QuantitySchema,
		product_id: z.string().openapi({
			description: 'The product id',
			example: '123e4567-e89b-12d3-a456-426655440000'
		}),
		customer_id: z.string().openapi({
			description: 'The customer id',
			example: '123e4567-e89b-12d3-a456-426655440000'
		}),
		seller_id: z.string().openapi({
			description: 'The seller id',
			example: '123e4567-e89b-12d3-a456-426655440000'
		})
	})
	.openapi('CreateOrderSchema');

const UpdateOrderBodySchema = z
	.object({
		price: PriceSchema,
		quantity: QuantitySchema,
		status: z
			.union([
				z.literal('created'),
				z.literal('accepted'),
				z.literal('rejected'),
				z.literal('shipped'),
				z.literal('shipping_in_progress')
			])
			.optional()
			.openapi({
				description: 'The order status',
				example: 'created'
			})
	})
	.openapi('UpdateOrderBodySchema');

const OrderResponseSchema = z
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

const GetOrderByIdResponseSchema = OrderResponseSchema.openapi('GetOrderByIdResponseSchema');
const ListOrdersResponseSchema = z
	.object({ items: z.array(OrderResponseSchema).default([]) })
	.openapi('ListOrdersResponseSchema');
const ErrorResponseSchema = z
	.object({ success: z.boolean(), message: z.string() })
	.openapi('ErrorResponseSchema');

const paramsSchema = z.object({
	orderId: z
		.string()
		.uuid()
		.openapi({
			param: { name: 'orderId', in: 'path', required: true },
			example: '123e4567-e89b-12d3-a456-426655440000'
		})
});

const commonErrorResponses = {
	400: {
		description: 'Bad request',
		content: {
			'application/json': { schema: ErrorResponseSchema }
		}
	},
	500: {
		description: 'Internal server error',
		content: {
			'application/json': { schema: ErrorResponseSchema }
		}
	}
};

/* Route Definitions */

export const CreateOrderRouteSchema = createRoute({
	method: 'post',
	path: '/orders',
	request: {
		body: {
			content: {
				'application/json': {
					schema: CreateOrderBodySchema
				}
			}
		}
	},
	responses: {
		201: {
			description: 'Order created successfully',
			content: {
				'application/json': { schema: z.object({ success: z.boolean() }) }
			}
		},
		...commonErrorResponses
	}
});

export const UpdateOrderRouteSchema = createRoute({
	method: 'put',
	path: '/orders/{orderId}',
	request: {
		params: paramsSchema,
		body: {
			content: {
				'application/json': {
					schema: UpdateOrderBodySchema
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Order updated successfully',
			content: {
				'application/json': { schema: z.object({ success: z.boolean() }) }
			}
		},
		404: {
			description: 'Order not found',
			content: {
				'application/json': { schema: ErrorResponseSchema }
			}
		},
		...commonErrorResponses
	}
});

export const GetOrderByIdRouteSchema = createRoute({
	method: 'get',
	path: '/orders/{orderId}',
	request: {
		params: paramsSchema
	},
	responses: {
		200: {
			description: 'Order found',
			content: {
				'application/json': { schema: GetOrderByIdResponseSchema }
			}
		},
		...commonErrorResponses
	}
});

export const ListOrdersRouteSchema = createRoute({
	method: 'get',
	path: '/orders',
	responses: {
		200: {
			description: 'Orders list',
			content: {
				'application/json': {
					schema: ListOrdersResponseSchema
				}
			}
		},
		...commonErrorResponses
	}
});
