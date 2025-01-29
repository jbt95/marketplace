import { Order } from '../order';

export class OrderRejected {
	public readonly date = new Date();

	constructor(public readonly order: Order) {}
}
