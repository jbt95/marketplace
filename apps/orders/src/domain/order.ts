import { EventEmitter } from './event-emitter';
import { OrderAccepted } from './events/order-accepted';
import { OrderCreated } from './events/order-created';
import { OrderRejected } from './events/order-rejected';
import { OrderShipped } from './events/order-shipped';
import { OrderShippingInProgress } from './events/order-shipping-in-progress';
import { OrderUpdated } from './events/order-updated';

export type Status = 'created' | 'accepted' | 'rejected' | 'shipping_in_progress' | 'shipped';

export interface MarshalledOrder {
	id: string;
	price: number;
	quantity: number;
	status: Status;
	product_id: string;
	customer_id: string;
	seller_id: string;
	created_at: string;
	updated_at?: string;
}

export class Order {
	public static eventEmitter: EventEmitter;

	public _status: Status = 'created';
	public created_at = new Date();
	public updated_at?: Date;

	constructor(
		public readonly id: string,
		private _price: number,
		private _quantity: number,
		public readonly product_id: string,
		public readonly customer_id: string,
		public readonly seller_id: string
	) {
		Order.eventEmitter.emit(new OrderCreated(this));
	}

	public get status(): Status {
		return this._status;
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

	/* v8 ignore start */
	public toJSON(): MarshalledOrder {
		return {
			id: this.id,
			price: this.price,
			quantity: this.quantity,
			status: this.status,
			product_id: this.product_id,
			customer_id: this.customer_id,
			seller_id: this.seller_id,
			created_at: this.created_at.toISOString(),
			updated_at: this.updated_at?.toISOString()
		};
	}
	/* v8 ignore end */
}
