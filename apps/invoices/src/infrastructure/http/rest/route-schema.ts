import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

const CreateInvoiceSchema = z.object({
	id: z.string().uuid(),
	order_id: z.string().uuid(),
	url: z.string().url()
});

const ErrorResponseSchema = z.object({ success: z.boolean(), message: z.string() });

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

export const CreateInvoiceRouteSchema = createRoute({
	method: 'post',
	path: '/invoices',
	request: {
		body: {
			content: {
				'application/json': {
					schema: CreateInvoiceSchema
				}
			}
		}
	},
	responses: {
		201: {
			description: 'Invoice created successfully',
			content: {
				'application/json': { schema: z.object({ success: z.boolean() }) }
			}
		},
		...commonErrorResponses
	}
});
