import { OpenAPIHono } from '@hono/zod-openapi';
import { logger as HonoLogger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { timing } from 'hono/timing';
import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { invoiceApp } from './infrastructure/http/rest/handler';
import { cors } from 'hono/cors';
import * as amqp from 'amqplib';
import { RabbitMqEventConsumer } from './infrastructure/events/rabbitmq-event-consumer';

const main = async () => {
	const consumer = new RabbitMqEventConsumer();
	const app = new OpenAPIHono().basePath('/api/v1');

	app.use(
		'*',
		cors({
			origin: ['http://localhost:4200']
		})
	);
	app.use(secureHeaders());
	app.use(prettyJSON());
	app.use(timing());
	app.use(HonoLogger());

	app.route('/', invoiceApp);

	app.get('/docs', swaggerUI({ url: '/api/v1/docs/openapi' }));
	app.doc('/docs/openapi', {
		openapi: '3.0.0',
		servers: [{ url: 'http://localhost:4200/api/v1' }],
		info: { version: '1.0.0', title: 'Invoices API' }
	});

	await consumer.consume();

	serve({ fetch: app.fetch, port: 4200 }, (v) => console.log(`[INFO] Listening on port ${v.port}`));
};

main()
	.then(() => console.log('Server started'))
	.catch((err) => console.error(err));
