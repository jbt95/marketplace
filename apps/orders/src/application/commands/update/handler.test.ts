import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateOrderCommandHandler } from './handler';
import { InMemoryRepository } from '@/infrastructure/persistence/in-memory-repository';
import { Order } from '@/domain/order';
import { OrderNotFoundError } from './order-not-found.error';

describe('When updating an order', () => {
	const inMemoryRepository = new InMemoryRepository();
	const id = 'id';
	const product_id = 'productId';
	const price = 100;
	const quantity = 1;
	const customer_id = '123';
	const seller_id = '123';
	const commandHandler = new UpdateOrderCommandHandler(inMemoryRepository);
	const order = new Order(id, price, quantity, product_id, customer_id, seller_id);

	beforeEach(async () => {
		inMemoryRepository.orders = [];
		await inMemoryRepository.create(order);
	});

	it('should update the order', async () => {
		await commandHandler.execute({
			id,
			price,
			quantity: quantity + 1,
			product_id,
			customer_id,
			seller_id
		});
		const updatedOrder = await inMemoryRepository.findById(id);
		expect(updatedOrder).toBeInstanceOf(Order);
		expect(updatedOrder?.price).toBe(100);
		expect(updatedOrder?.quantity).toBe(quantity + 1);
		expect(updatedOrder?.product_id).toBe(product_id);
		expect(updatedOrder?.customer_id).toBe('123');
		expect(updatedOrder?.seller_id).toBe('123');
	});

	describe('when there is a validation error', () => {
		it('should throw an error', async () => {
			await expect(
				commandHandler.execute({
					id,
					price: '100' as unknown as number,
					quantity: 1,
					product_id: 'productId',
					customer_id: '123',
					seller_id: '123'
				})
			).rejects.toThrow(Error);
		});
	});

	describe('when the order does not exist', () => {
		beforeEach(() => {
			inMemoryRepository.orders = [];
		});
		it('should throw an error', async () => {
			await expect(
				commandHandler.execute({
					id: 'id',
					price,
					quantity,
					product_id,
					customer_id,
					seller_id
				})
			).rejects.toThrow(OrderNotFoundError);
		});
	});
});
