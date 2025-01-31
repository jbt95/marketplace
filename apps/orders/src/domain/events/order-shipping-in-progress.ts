import { Order } from '../order';

export class OrderShippingInProgress {
	public readonly type = 'order.shipping-in-progress';
	public readonly date = new Date();

	constructor(public readonly order: Order) {}
}
