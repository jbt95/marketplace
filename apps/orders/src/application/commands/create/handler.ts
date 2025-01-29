import { Order } from '@/domain/order';
import { OrderRepository } from '@/domain/repository';
import { z } from 'zod';
import { OrderAlreadyExistsError } from './order-already-exists.error';

const schema = z.object({
	id: z.string(),
	price: z.number().min(1),
	quantity: z.number().min(1),
	product_id: z.string(),
	customer_id: z.string(),
	seller_id: z.string()
});

type CreateOrderCommandSchema = z.infer<typeof schema>;

export class CreateOrderCommandHandler {
	constructor(private readonly orderRepository: OrderRepository) {}

	async execute(command: CreateOrderCommandSchema): Promise<void> {
		const parsed = schema.parse(command);
		const order = await this.orderRepository.findById(parsed.id);
		if (order) {
			throw new OrderAlreadyExistsError();
		}
		await this.orderRepository.create(
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
