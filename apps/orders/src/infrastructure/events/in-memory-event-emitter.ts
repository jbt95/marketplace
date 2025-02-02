import { DomainEvent, EventEmitter } from '@/domain/event-emitter';

export class InMemoryEventEmitter implements EventEmitter {
	public events: DomainEvent[] = [];

	emit(event: DomainEvent): void {
		console.log(`[INFO] Event emitted: ${event.type}`);
		this.events.push(event);
	}
}
