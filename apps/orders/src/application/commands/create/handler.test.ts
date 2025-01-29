import { describe, it, expect, beforeEach } from 'vitest';
import { CreateOrderCommandHandler } from './handler';
import { InMemoryRepository } from '@/infrastructure/persistence/in-memory-repository';
import { ZodError } from 'zod';
import { Order } from '@/domain/order';
import { OrderAlreadyExistsError } from './order-already-exists.error';
import { OrderCreated } from '@/domain/events/order-created';
import { InMemoryEventEmitter } from '@/infrastructure/events/in-memory-event-emitter';

describe('When creating a new order', () => {
	const inMemoryRepository = new InMemoryRepository();
	const id = 'id';
	const product_id = 'productId';
	const price = 100;
	const quantity = 1;
	const customer_id = '123';
	const seller_id = '123';
	const commandHandler = new CreateOrderCommandHandler(inMemoryRepository);
	const inMemoryEventEmitter = new InMemoryEventEmitter();

	beforeEach(() => {
		inMemoryRepository.orders = [];
		inMemoryEventEmitter.events = [];
		Order.eventEmitter = inMemoryEventEmitter;
	});

	it('should create a new order', async () => {
		await commandHandler.execute({
			id,
			price,
			quantity,
			product_id,
			customer_id,
			seller_id
		});
		const order = await inMemoryRepository.findById(id);
		expect(order).toBeInstanceOf(Order);
		expect(order?.price).toBe(100);
		expect(order?.quantity).toBe(1);
		expect(order?.product_id).toBe(product_id);
		expect(order?.customer_id).toBe('123');
		expect(order?.seller_id).toBe('123');
	});

	it('should emit an event', async () => {
		await commandHandler.execute({
			id,
			price,
			quantity,
			product_id,
			customer_id,
			seller_id
		});
		expect(inMemoryEventEmitter.events.at(0)).toBeInstanceOf(OrderCreated);
		const event = inMemoryEventEmitter.events.at(0) as OrderCreated;
		expect(event.order.id).toBe(id);
		expect(event.order.price).toBe(price);
		expect(event.order.quantity).toBe(quantity);
		expect(event.order.product_id).toBe(product_id);
		expect(event.order.customer_id).toBe(customer_id);
		expect(event.order.seller_id).toBe(seller_id);
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
			).rejects.toThrow(ZodError);
		});
	});

	describe('when the price is less than 1', () => {
		it('should throw an error', async () => {
			await expect(
				commandHandler.execute({
					id,
					price: -1,
					quantity: 1,
					product_id: 'productId',
					customer_id: '123',
					seller_id: '123'
				})
			).rejects.toThrow(ZodError);
		});
	});

	describe('when the quantity is less than 1', () => {
		it('should throw an error', async () => {
			await expect(
				commandHandler.execute({
					id,
					price: 1,
					quantity: -1,
					product_id: 'productId',
					customer_id: '123',
					seller_id: '123'
				})
			).rejects.toThrow(ZodError);
		});
	});

	describe('when the order already exists', () => {
		beforeEach(async () => {
			await inMemoryRepository.create(
				new Order(id, price, quantity, product_id, customer_id, seller_id)
			);
		});
		it('should throw an error', async () => {
			await expect(
				commandHandler.execute({
					id,
					price,
					quantity,
					product_id,
					customer_id,
					seller_id
				})
			).rejects.toThrow(OrderAlreadyExistsError);
		});
	});
});
