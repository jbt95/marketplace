import { DomainEvents, EventEmitter } from '@/domain/event-emitter';
import * as amqp from 'amqplib';

export class RabbitMqEventEmitter implements EventEmitter {
	private static readonly RABBITMQ_URL = 'amqp://guest:guest@rabbitmq';
	private static readonly queueName = 'orders';
	private connection: amqp.Connection | undefined;
	private channel: amqp.Channel | undefined;

	constructor() {}

	async emit(event: DomainEvents) {
		if (!this.connection) {
			this.connection = await amqp.connect(RabbitMqEventEmitter.RABBITMQ_URL);
			this.channel = await this.connection.createChannel();
			await this.channel.assertQueue(RabbitMqEventEmitter.queueName);
		}
		const sent = this.channel?.sendToQueue(
			RabbitMqEventEmitter.queueName,
			Buffer.from(
				JSON.stringify({
					timestamp: event.date.toISOString(),
					...event.order.toJSON()
				})
			)
		);
		if (sent) {
			console.log(`[INFO] Event emitted: ${event.type}`);
		}
	}
}
