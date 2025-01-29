export type Status = 'created' | 'accepted' | 'rejected' | 'shipping in progress' | 'shipped';

export class Order {
	public readonly status: Status = 'created';

	constructor(
		public readonly id: string,
		public readonly price: number,
		public readonly quantity: number,
		public readonly product_id: string,
		public readonly customer_id: string,
		public readonly seller_id: string
	) {}
}
