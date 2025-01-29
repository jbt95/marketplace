import { Order } from '@/domain/order';
import { OrderRepository } from '@/domain/repository';
import { z } from 'zod';
import { OrderNotFoundError } from './order-not-found.error';

const schema = z.object({
	id: z.string(),
	price: z.number(),
	quantity: z.number(),
	product_id: z.string(),
	customer_id: z.string(),
	seller_id: z.string()
});

type UpdateOrderCommandSchema = z.infer<typeof schema>;

export class UpdateOrderCommandHandler {
	constructor(private readonly orderRepository: OrderRepository) {}

	async execute(command: UpdateOrderCommandSchema): Promise<void> {
		const parsed = schema.parse(command);
		const order = await this.orderRepository.findById(parsed.id);
		if (!order) {
			throw new OrderNotFoundError();
		}
		await this.orderRepository.update(
			new Order(
				parsed.id,
				parsed.price,
				parsed.quantity,
				parsed.product_id,
				parsed.customer_id,
				parsed.seller_id
			)
		);
	}
}
