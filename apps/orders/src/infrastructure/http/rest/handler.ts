import { CreateOrderCommandHandler } from '@/application/commands/create/handler';
import { UpdateOrderCommandHandler } from '@/application/commands/update/handler';
import { GetOrderByIdQueryHandler } from '@/application/queries/get-by-id/handler';
import { ListOrdersQueryHandler } from '@/application/queries/list/handler';
import { OpenAPIHono } from '@hono/zod-openapi';
import {
	CreateOrderRouteSchema,
	GetOrderByIdRouteSchema,
	ListOrdersRouteSchema,
	UpdateOrderRouteSchema
} from './route-schema';
import { errorHandler } from './error-handler';
import { Order } from '@/domain/order';
import { DynamoDBRepository } from '@/infrastructure/persistence/dynamodb-repository';
import { InMemoryEventEmitter } from '@/infrastructure/events/in-memory-event-emitter';

export const ordersApp = new OpenAPIHono();

Order.eventEmitter = new InMemoryEventEmitter();

const repository = new DynamoDBRepository();
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
	updateOrderCommandHandler
		.execute({
			id: c.req.valid('param').orderId,
			...c.req.valid('json')
		})
		.then(() =>
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
