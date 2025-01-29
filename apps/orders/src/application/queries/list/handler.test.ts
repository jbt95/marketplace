import { Order } from '@/domain/order';
import { beforeEach, describe, expect, it } from 'vitest';
import { ListOrdersQueryHandler } from './handler';
import { InMemoryRepository } from '@/infrastructure/persistence/in-memory-repository';
import { InMemoryEventEmitter } from '@/infrastructure/events/in-memory-event-emitter';

describe('When listing orders', () => {
	Order.eventEmitter = new InMemoryEventEmitter();
	const inMemoryRepository = new InMemoryRepository();
	const id = 'id';
	const product_id = 'productId';
	const price = 100;
	const quantity = 1;
	const customer_id = '123';
	const seller_id = '123';
	const commandHandler = new ListOrdersQueryHandler(inMemoryRepository);
	const order = new Order(id, price, quantity, product_id, customer_id, seller_id);

	beforeEach(async () => {
		inMemoryRepository.orders = [];
		await inMemoryRepository.create(order);
	});

	it('should return a list of the orders', async () => {
		expect(await commandHandler.execute()).toStrictEqual({
			items: [
				{
					id,
					price,
					quantity,
					product_id,
					customer_id,
					seller_id
				}
			]
		});
	});

	describe('when there are no orders', () => {
		beforeEach(() => {
			inMemoryRepository.orders = [];
		});
		it('should return an empty list', async () => {
			expect(await commandHandler.execute()).toStrictEqual({
				items: []
			});
		});
	});
});
