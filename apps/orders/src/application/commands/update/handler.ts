import { OrderRepository } from '@/domain/repository';
import { z } from 'zod';
import { OrderNotFoundError } from './order-not-found.error';

const schema = z.object({
	id: z.string(),
	price: z.number().min(1).optional(),
	quantity: z.number().min(1).optional(),
	status: z.union([z.literal('created'), z.literal('accepted'), z.literal('rejected')]).optional()
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
		order.price = parsed.price ?? order.price;
		order.quantity = parsed.quantity ?? order.quantity;
		order.status = parsed.status ?? order.status;
		await this.orderRepository.update(order);
	}
}
