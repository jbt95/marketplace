import { OpenAPIHono } from '@hono/zod-openapi';
import { logger as HonoLogger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { timing } from 'hono/timing';
import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { ordersApp } from '@/infrastructure/http/rest/handler';

const app = new OpenAPIHono().basePath('/api/v1');

app.use(secureHeaders());
app.use(prettyJSON());
app.use(timing());
app.use(HonoLogger());

app.route('/', ordersApp);

app.get('/docs', swaggerUI({ url: '/api/v1/docs/openapi' }));
app.doc('/docs/openapi', {
	openapi: '3.0.0',
	servers: [{ url: 'http://localhost:3000/api/v1' }],
	info: { version: '1.0.0', title: 'Orders API' }
});

serve(app, (v) => console.log(`[INFO] Listening on port ${v.port}`));
