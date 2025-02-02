import * as amqp from 'amqplib';
import { SendInvoiceHandler } from '@/application/commands/send/handler';
import { InMemoryNotificationService } from '../notifications/in-memory-notification-service';
import { DynamoDBRepository } from '../persistence/dynamodb-repository';

type ISODateString = string;

interface OrderShipped {
	type: 'order.shipped';
	payload: { id: string };
	timestamp: ISODateString;
}

type DomainEvents = OrderShipped;

export class RabbitMqEventConsumer {
	private static readonly RABBITMQ_URL = 'amqp://guest:guest@rabbitmq';
	private static readonly queueName = 'orders';
	private connection: amqp.Connection | undefined;
	private channel: amqp.Channel | undefined;

	private sendInvoiceHandler = new SendInvoiceHandler(
		new InMemoryNotificationService(),
		new DynamoDBRepository()
	);

	constructor() {}

	async consume() {
		if (!this.connection) {
			this.connection = await amqp.connect(RabbitMqEventConsumer.RABBITMQ_URL);
			this.channel = await this.connection.createChannel();
			await this.channel.assertQueue(RabbitMqEventConsumer.queueName);
			console.log(`[INFO] RabbitMQ consumer started...`);
		}
		await this.channel?.consume(RabbitMqEventConsumer.queueName, async (msg) => {
			if (msg) {
				const event = JSON.parse(msg.content.toString()) as DomainEvents;
				console.log(`[INFO] Event received: ${event.type}`, event);
				await this.eventHandler(event);
				this.channel?.ack(msg);
			}
		});
	}

	private async eventHandler(event: DomainEvents): Promise<void> {
		switch (event.type) {
			case 'order.shipped':
				return this.sendInvoiceHandler.execute({
					orderId: event.payload.id,
					date: event.timestamp
				});
			default:
				break;
		}
	}
}
