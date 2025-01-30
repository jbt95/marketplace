import { InMemoryInvoiceRepository } from '@/infrastructure/persistence/in-memory-repository';
import { OpenAPIHono } from '@hono/zod-openapi';
import { errorHandler } from './error-handler';
import { CreateInvoiceHandler } from '@/application/commands/create/handler';
import { SendInvoiceHandler } from '@/application/commands/send/handler';
import { InMemoryNotificationService } from '@/infrastructure/notifications/in-memory-notification-service';
import { CreateInvoiceRouteSchema, SendInvoiceRouteSchema } from './route-schema';

export const invoiceApp = new OpenAPIHono();

const repository = new InMemoryInvoiceRepository();
const notificationService = new InMemoryNotificationService();
const createInvoiceCommandHandler = new CreateInvoiceHandler(repository);
const sendInvoiceCommandHandler = new SendInvoiceHandler(notificationService, repository);

invoiceApp.openapi(CreateInvoiceRouteSchema, (c) =>
	createInvoiceCommandHandler.execute(c.req.valid('json')).then(() =>
		c.json(
			{
				success: true
			},
			201
		)
	)
);

invoiceApp.openapi(SendInvoiceRouteSchema, (c) =>
	sendInvoiceCommandHandler.execute(c.req.valid('param')).then(() =>
		c.json(
			{
				success: true
			},
			200
		)
	)
);

invoiceApp.onError(errorHandler);
