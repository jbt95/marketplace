import { Order } from '../order';

export class OrderAccepted {
	public readonly date = new Date();

	constructor(public readonly order: Order) {}
}
