import { OrderRepository } from '@/domain/repository';
import { OrderListResponse } from '../response.schema';

export class ListOrdersQueryHandler {
	constructor(private readonly orderRepository: OrderRepository) {}

	async execute(): Promise<OrderListResponse> {
		const orders = await this.orderRepository.list();

		return {
			items: orders.map((order) => ({
				id: order.id,
				price: order.price,
				quantity: order.quantity,
				product_id: order.product_id,
				customer_id: order.customer_id,
				seller_id: order.seller_id
			}))
		};
	}
}
