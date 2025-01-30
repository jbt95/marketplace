import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

const CreateOrderBodySchema = z.object({
	id: z.string().uuid(),
	price: z.number().min(1),
	quantity: z.number().min(1),
	product_id: z.string(),
	customer_id: z.string(),
	seller_id: z.string()
});

const UpdateOrderBodySchema = z.object({
	id: z.string().uuid(),
	price: z.number().min(1).optional(),
	quantity: z.number().min(1).optional(),
	status: z.union([z.literal('created'), z.literal('accepted'), z.literal('rejected')]).optional()
});

const OrderResponseSchema = z
	.object({
		id: z.string(),
		price: z.number(),
		quantity: z.number(),
		product_id: z.string(),
		customer_id: z.string(),
		seller_id: z.string()
	})
	.optional();

const GetOrderByIdResponseSchema = OrderResponseSchema;
const ListOrdersResponseSchema = z.object({ items: z.array(OrderResponseSchema).default([]) });
const ErrorResponseSchema = z.object({ success: z.boolean(), message: z.string() });

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
	path: '/orders/{id}',
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
	path: '/orders/{id}',
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
