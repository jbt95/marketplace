import { OrdersRepository } from '@/domain/repository';
import { z } from 'zod';
import { OrderResponse } from '../response.schema';

const schema = z.object({ id: z.string() });

type GetOrderByIdQuerySchema = z.infer<typeof schema>;

export class GetOrderByIdQueryHandler {
	constructor(private readonly orderRepository: OrdersRepository) {}

	async execute(query: GetOrderByIdQuerySchema): Promise<OrderResponse | undefined> {
		const parsed = schema.parse(query);
		const order = await this.orderRepository.findById(parsed.id);
		if (!order) return;
		return {
			id: order.id,
			price: order.price,
			quantity: order.quantity,
			product_id: order.product_id,
			customer_id: order.customer_id,
			seller_id: order.seller_id,
			created_at: order.created_at.toISOString(),
			updated_at: order.updated_at?.toISOString(),
			status: order.status
		};
	}
}
