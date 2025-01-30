import { CreateOrderCommandHandler } from '@/application/commands/create/handler';
import { UpdateOrderCommandHandler } from '@/application/commands/update/handler';
import { GetOrderByIdQueryHandler } from '@/application/queries/get-by-id/handler';
import { ListOrdersQueryHandler } from '@/application/queries/list/handler';
import { InMemoryRepository } from '@/infrastructure/persistence/in-memory-repository';
import { OpenAPIHono } from '@hono/zod-openapi';
import {
	CreateOrderRouteSchema,
	GetOrderByIdRouteSchema,
	ListOrdersRouteSchema,
	UpdateOrderRouteSchema
} from './route-schema';
import { errorHandler } from './error-handler';

export const ordersApp = new OpenAPIHono();

const repository = new InMemoryRepository();
const createOrderCommandHandler = new CreateOrderCommandHandler(repository);
const updateOrderCommandHandler = new UpdateOrderCommandHandler(repository);
const getOrderByIdQueryHandler = new GetOrderByIdQueryHandler(repository);
const listOrdersQueryHandler = new ListOrdersQueryHandler(repository);

ordersApp.openapi(CreateOrderRouteSchema, (c) =>
	createOrderCommandHandler.execute(c.req.valid('json')).then(() =>
		c.json(
			{
				success: true
			},
			201
		)
	)
);

ordersApp.openapi(UpdateOrderRouteSchema, (c) =>
	updateOrderCommandHandler.execute(c.req.valid('json')).then(() =>
		c.json(
			{
				success: true
			},
			200
		)
	)
);

ordersApp.openapi(GetOrderByIdRouteSchema, (c) =>
	getOrderByIdQueryHandler
		.execute({ id: c.req.param('orderId')! })
		.then((order) => c.json(order, 200))
);

ordersApp.openapi(ListOrdersRouteSchema, (c) =>
	listOrdersQueryHandler.execute().then((orders) => c.json(orders, 200))
);

ordersApp.onError(errorHandler);
