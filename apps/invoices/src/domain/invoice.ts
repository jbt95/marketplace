export class Invoice {
	public createdAt = new Date();
	public sentAt?: Date;

	constructor(
		public readonly id: string,
		public readonly orderId: string,
		public url: string
	) {}
}
