import { Order } from '../order';

export class OrderAccepted {
	public readonly type = 'order.accepted';
	public readonly date = new Date();

	constructor(public readonly order: Order) {}
}
