import { OrderAccepted } from './events/order-accepted';
import { OrderCreated } from './events/order-created';
import { OrderRejected } from './events/order-rejected';
import { OrderShipped } from './events/order-shipped';
import { OrderShippingInProgress } from './events/order-shipping-in-progress';
import { OrderUpdated } from './events/order-updated';

export type DomainEvents =
	| OrderCreated
	| OrderUpdated
	| OrderAccepted
	| OrderRejected
	| OrderShippingInProgress
	| OrderShipped;

export interface EventEmitter {
	emit(event: DomainEvents): void;
}
