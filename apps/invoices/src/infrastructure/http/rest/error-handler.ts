import { InvoiceAlreadyExistsError } from '@/application/commands/create/invoice-already-exists.error';
import { InvoiceNotFoundError } from '@/application/commands/send/invoice-not-found.error';
import { ErrorHandler } from 'hono';
import { ZodError } from 'zod';

export const errorHandler: ErrorHandler = (err, c) => {
	if (err instanceof InvoiceAlreadyExistsError || err instanceof InvoiceNotFoundError || ZodError) {
		return c.json({ success: false, message: err.message }, 400);
	}
	return c.json({ success: false, message: 'Internal server error' }, 500);
};
