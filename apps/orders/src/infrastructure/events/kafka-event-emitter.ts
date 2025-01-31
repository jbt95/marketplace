import { DomainEvents, EventEmitter } from '@/domain/event-emitter';
import { kafkaClient } from '@marketplace/kafka';

export class KafkaEventEmitter implements EventEmitter {
	private producer = kafkaClient.producer();

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
