import { DomainEvents, EventEmitter } from '@/domain/event-emitter';
import { Kafka } from 'kafkajs';

export class KafkaEventEmitter implements EventEmitter {
	private client = new Kafka({
		clientId: 'marketplace',
		brokers: ['localhost:9092']
	});

	private producer = this.client.producer();

	constructor() {
		this.producer.connect();
	}

	async emit(event: DomainEvents) {
		await this.producer.connect();
		await this.producer.send({
			topic: 'orders',
			messages: [
				{
					key: event.type,
					value: JSON.stringify({ timestamp: event.date.toISOString(), ...event.order.toJSON() })
				}
			]
		});
	}
}
