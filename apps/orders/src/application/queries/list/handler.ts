import { OrdersRepository } from '@/domain/repository';
import { OrderListResponse } from '../response.schema';

export class ListOrdersQueryHandler {
	constructor(private readonly orderRepository: OrdersRepository) {}

	async execute(): Promise<OrderListResponse> {
		const orders = await this.orderRepository.list();

		return {
			items: orders.map((order) => ({
				id: order.id,
				price: order.price,
				quantity: order.quantity,
				product_id: order.product_id,
				customer_id: order.customer_id,
				seller_id: order.seller_id,
				created_at: order.created_at.toISOString(),
				updated_at: order.updated_at?.toISOString(),
				status: order.status
			}))
		};
	}
}
