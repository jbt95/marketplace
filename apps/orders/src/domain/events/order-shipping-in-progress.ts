export class OrderShippingInProgress {
	public readonly date = new Date();

	constructor(public readonly orderId: string) {}
}
