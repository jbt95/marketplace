import { InvoiceAlreadyExistsError } from '@/application/commands/create/invoice-already-exists.error';
import { InvoiceNotFoundError } from '@/application/commands/send/invoice-not-found.error';
import { ErrorHandler } from 'hono';
import { ZodError } from 'zod';

const errors = [InvoiceAlreadyExistsError, InvoiceNotFoundError, ZodError];

export const errorHandler: ErrorHandler = (err, c) => {
	if (errors.some((error) => err instanceof error)) {
		return c.json(
			{
				success: false,
				message: err.message,
				type: err.name,
				cause: err.cause,
				status: 400
			},
			400
		);
	}
	return c.json({ success: false, message: 'Internal server error' }, 500);
};
