import { DomainEvents, EventEmitter } from '@/domain/event-emitter';

export class InMemoryEventEmitter implements EventEmitter {
	public events: DomainEvents[] = [];

	emit(event: DomainEvents): void {
		console.log(`[INFO] Event emitted: ${event.type}`);
		this.events.push(event);
	}
}
