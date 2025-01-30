import { OrderAlreadyExistsError } from '@/application/commands/create/order-already-exists.error';
import { ErrorHandler } from 'hono';
import { ZodError } from 'zod';

export const errorHandler: ErrorHandler = (err, c) => {
	if (err instanceof OrderAlreadyExistsError || ZodError) {
		return c.json({ success: false, message: err.message }, 400);
	}
	return c.json({ success: false, message: 'Internal server error' }, 500);
};
