import { OrderAlreadyExistsError } from '@/application/commands/create/order-already-exists.error';
import { OrderNotFoundError } from '@/application/commands/update/order-not-found.error';
import { OrderShippedError } from '@/domain/errors/order-shipped.error';
import { ErrorHandler } from 'hono';
import { ZodError } from 'zod';

const errors = [OrderAlreadyExistsError, ZodError, OrderNotFoundError, OrderShippedError];

export const errorHandler: ErrorHandler = (err, c) => {
	if (errors.some((error) => err instanceof error)) {
		return c.json(
			{
				success: false,
				message: err.message,
				cause: err.cause,
				type: err.name,
				status: 400
			},
			400
		);
	}
	return c.json(
		{
			success: false,
			message: 'Internal server error'
		},
		500
	);
};
