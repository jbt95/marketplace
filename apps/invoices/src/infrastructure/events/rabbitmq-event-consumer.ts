import * as amqp from 'amqplib';

export class RabbitMqEventConsumer {
	private static readonly RABBITMQ_URL = 'amqp://guest:guest@rabbitmq';
	private static readonly queueName = 'orders';
	private connection: amqp.Connection | undefined;
	private channel: amqp.Channel | undefined;

	constructor() {}

	async consume() {
		if (!this.connection) {
			this.connection = await amqp.connect(RabbitMqEventConsumer.RABBITMQ_URL);
			this.channel = await this.connection.createChannel();
			await this.channel.assertQueue(RabbitMqEventConsumer.queueName);
		}
		this.channel?.consume(RabbitMqEventConsumer.queueName, async (msg) => {
			if (msg) {
				const content = JSON.parse(msg.content.toString());
				console.log(`Received message from ${RabbitMqEventConsumer.queueName}:`, content);
				this.channel?.ack(msg);
			}
		});
	}
}
