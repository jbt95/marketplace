export interface MarshalledInvoice {
	id: string;
	order_id: string;
	url: string;
	created_at: string;
	sent_at?: string;
}

export class Invoice {
	public created_at = new Date();
	public sentAt?: Date;

	constructor(
		public readonly id: string,
		public readonly orderId: string,
		public url: string
	) {}

	public toJSON(): MarshalledInvoice {
		return {
			id: this.id,
			order_id: this.orderId,
			url: this.url,
			created_at: this.created_at.toISOString(),
			sent_at: this.sentAt?.toISOString()
		};
	}
}
