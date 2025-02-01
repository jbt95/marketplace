import { InMemoryInvoiceRepository } from '@/infrastructure/persistence/in-memory-repository';
import { OpenAPIHono } from '@hono/zod-openapi';
import { errorHandler } from './error-handler';
import { CreateInvoiceHandler } from '@/application/commands/create/handler';
import { CreateInvoiceRouteSchema } from './route-schema';
import { DynamoDBRepository } from '@/infrastructure/persistence/dynamodb-repository';

export const invoiceApp = new OpenAPIHono();

const repository = new DynamoDBRepository();
const createInvoiceCommandHandler = new CreateInvoiceHandler(repository);

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

invoiceApp.onError(errorHandler);
