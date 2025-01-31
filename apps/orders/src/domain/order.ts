import { EventEmitter } from './event-emitter';
import { OrderAccepted } from './events/order-accepted';
import { OrderCreated } from './events/order-created';
import { OrderRejected } from './events/order-rejected';
import { OrderShipped } from './events/order-shipped';
import { OrderShippingInProgress } from './events/order-shipping-in-progress';
import { OrderUpdated } from './events/order-updated';

export type Status = 'created' | 'accepted' | 'rejected' | 'shipping_in_progress' | 'shipped';

export class Order {
	public static eventEmitter: EventEmitter;

	public _status: Status = 'created';

	constructor(
		public readonly id: string,
		public _price: number,
		public _quantity: number,
		public readonly product_id: string,
		public readonly customer_id: string,
		public readonly seller_id: string
	) {
		Order.eventEmitter.emit(new OrderCreated(this));
	}

	public get status(): Status {
		return this._status;
	}

	public get price(): number {
		return this._price;
	}

	public set price(price: number) {
		if (this._price === price) {
			return;
		}
		this._price = price;
		Order.eventEmitter.emit(new OrderUpdated(this));
	}

	public get quantity(): number {
		return this._quantity;
	}

	public set quantity(quantity: number) {
		if (this._quantity === quantity) {
			return;
		}
		this._quantity = quantity;
		Order.eventEmitter.emit(new OrderUpdated(this));
	}

	public set status(status: Omit<Status, 'created'>) {
		if (this._status === status) {
			return;
		}
		this._status = status as Status;
		switch (this._status) {
			case 'accepted':
				Order.eventEmitter.emit(new OrderAccepted(this));
				break;
			case 'rejected':
				Order.eventEmitter.emit(new OrderRejected(this));
				break;
			case 'shipping_in_progress':
				Order.eventEmitter.emit(new OrderShippingInProgress(this));
				break;
			case 'shipped':
				Order.eventEmitter.emit(new OrderShipped(this));
		}
	}

	public toJSON() {
		return {
			id: this.id,
			price: this.price,
			quantity: this.quantity,
			status: this.status,
			product_id: this.product_id,
			customer_id: this.customer_id,
			seller_id: this.seller_id
		};
	}
}
