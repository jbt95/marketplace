import { Order } from '../order';

export class OrderCreated {
	public readonly date = new Date();

	constructor(public readonly order: Order) {}
}
