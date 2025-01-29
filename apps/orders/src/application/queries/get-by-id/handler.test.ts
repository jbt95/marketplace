import { Order } from '@/domain/order';
import { InMemoryRepository } from '@/infrastructure/persistence/in-memory-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetOrderByIdQueryHandler } from './handler';

describe('When getting an order by id', () => {
	const inMemoryRepository = new InMemoryRepository();
	const id = 'id';
	const product_id = 'productId';
	const price = 100;
	const quantity = 1;
	const customer_id = '123';
	const seller_id = '123';
	const commandHandler = new GetOrderByIdQueryHandler(inMemoryRepository);
	const order = new Order(id, price, quantity, product_id, customer_id, seller_id);

	beforeEach(async () => {
		inMemoryRepository.orders = [];
		await inMemoryRepository.create(order);
	});

	it('should return the order', async () => {
		expect(await commandHandler.execute({ id })).toStrictEqual({
			id,
			price,
			quantity,
			product_id,
			customer_id,
			seller_id
		});
	});

	describe('when the order does not exist', () => {
		it('should return undefined', async () => {
			expect(await commandHandler.execute({ id: 'unknownId' })).toBeUndefined();
		});
	});
});
