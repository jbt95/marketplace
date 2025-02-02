export class OrderShippedError extends Error {
	constructor() {
		super('Order is already shipped and cannot be updated');
		this.name = 'OrderShippedError';
	}
}
