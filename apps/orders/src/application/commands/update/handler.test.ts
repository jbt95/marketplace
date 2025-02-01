import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateOrderCommandHandler } from './handler';
import { InMemoryRepository } from '@/infrastructure/persistence/in-memory-repository';
import { Order } from '@/domain/order';
import { OrderNotFoundError } from './order-not-found.error';
import { InMemoryEventEmitter } from '@/infrastructure/events/in-memory-event-emitter';
import { OrderUpdated } from '@/domain/events/order-updated';
import { OrderAccepted } from '@/domain/events/order-accepted';
import { OrderRejected } from '@/domain/events/order-rejected';
import { OrderShipped } from '@/domain/events/order-shipped';
import { OrderShippingInProgress } from '@/domain/events/order-shipping-in-progress';

describe('When updating an order', () => {
	const inMemoryRepository = new InMemoryRepository();
	const id = 'id';
	const product_id = 'productId';
	const price = 100;
	const quantity = 1;
	const customer_id = '123';
	const seller_id = '123';
	const commandHandler = new UpdateOrderCommandHandler(inMemoryRepository);
	const inMemoryEventEmitter = new InMemoryEventEmitter();

	beforeEach(async () => {
		inMemoryRepository.orders = [];
		inMemoryEventEmitter.events = [];
		Order.eventEmitter = inMemoryEventEmitter;
		await inMemoryRepository.create(
			new Order(id, price, quantity, product_id, customer_id, seller_id)
		);
	});

	describe('When the quantity is updated', () => {
		it('should update the order', async () => {
			await commandHandler.execute({ id, quantity: quantity + 1 });
			const updatedOrder = await inMemoryRepository.findById(id);
			expect(updatedOrder).toBeInstanceOf(Order);
			expect(updatedOrder?.quantity).toBe(quantity + 1);
		});

		it('should emit an event', async () => {
			await commandHandler.execute({ id, quantity: quantity + 1 });
			const event = inMemoryEventEmitter.events.find((event) => event instanceof OrderUpdated);
			expect(event).toBeInstanceOf(OrderUpdated);
			expect(event!.order.quantity).toBe(quantity + 1);
		});
	});

	describe('Whent the price is updated', () => {
		it('should update the order', async () => {
			await commandHandler.execute({ id, price: price + 1 });
			const updatedOrder = await inMemoryRepository.findById(id);
			expect(updatedOrder).toBeInstanceOf(Order);
			expect(updatedOrder?.price).toBe(price + 1);
		});

		it('should emit an event', async () => {
			await commandHandler.execute({ id, price: price + 1 });
			const event = inMemoryEventEmitter.events.find((event) => event instanceof OrderUpdated);
			expect(event).toBeInstanceOf(OrderUpdated);
			expect(event!.order.price).toBe(price + 1);
		});
	});

	describe('Whent the status is accepted', () => {
		it('should update the order', async () => {
			await commandHandler.execute({ id, status: 'accepted' });
			const updatedOrder = await inMemoryRepository.findById(id);
			expect(updatedOrder).toBeInstanceOf(Order);
			expect(updatedOrder?.status).toBe('accepted');
		});

		it('should emit an event', async () => {
			await commandHandler.execute({ id, status: 'accepted' });
			const event = inMemoryEventEmitter.events.find((event) => event instanceof OrderAccepted);
			expect(event).toBeInstanceOf(OrderAccepted);
			expect(event!.order.status).toBe('accepted');
		});
	});

	describe('Whent the status is rejected', () => {
		it('should update the order', async () => {
			await commandHandler.execute({ id, status: 'rejected' });
			const updatedOrder = await inMemoryRepository.findById(id);
			expect(updatedOrder).toBeInstanceOf(Order);
			expect(updatedOrder?.status).toBe('rejected');
		});

		it('should emit an event', async () => {
			await commandHandler.execute({ id, status: 'rejected' });
			const event = inMemoryEventEmitter.events.find((event) => event instanceof OrderRejected);
			expect(event).toBeInstanceOf(OrderRejected);
			expect(event!.order.status).toBe('rejected');
		});
	});

	describe('Whent the status is shipped', () => {
		it('should update the order', async () => {
			await commandHandler.execute({ id, status: 'shipped' });
			const updatedOrder = await inMemoryRepository.findById(id);
			expect(updatedOrder).toBeInstanceOf(Order);
			expect(updatedOrder?.status).toBe('shipped');
		});

		it('should emit an event', async () => {
			await commandHandler.execute({ id, status: 'shipped' });
			const event = inMemoryEventEmitter.events.find((event) => event instanceof OrderShipped);
			expect(event).toBeInstanceOf(OrderShipped);
			expect(event!.order.status).toBe('shipped');
		});
	});

	describe('Whent the status is shipping_in_progress', () => {
		it('should update the order', async () => {
			await commandHandler.execute({ id, status: 'shipping_in_progress' });
			const updatedOrder = await inMemoryRepository.findById(id);
			expect(updatedOrder).toBeInstanceOf(Order);
			expect(updatedOrder?.status).toBe('shipping_in_progress');
		});

		it('should emit an event', async () => {
			await commandHandler.execute({ id, status: 'shipping_in_progress' });
			const event = inMemoryEventEmitter.events.find(
				(event) => event instanceof OrderShippingInProgress
			);
			expect(event).toBeInstanceOf(OrderShippingInProgress);
			expect(event!.order.status).toBe('shipping_in_progress');
		});
	});

	describe('When the quantity is negative', () => {
		it('should throw an error', async () => {
			await expect(commandHandler.execute({ id, quantity: -1 })).rejects.toThrow(Error);
		});
	});

	describe('When the price is negative', () => {
		it('should throw an error', async () => {
			await expect(commandHandler.execute({ id, price: -1 })).rejects.toThrow(Error);
		});
	});

	describe('when there is a validation error', () => {
		it('should throw an error', async () => {
			await expect(
				commandHandler.execute({
					id,
					price: '100' as unknown as number
				})
			).rejects.toThrow(Error);
		});
	});

	describe('when the order does not exist', () => {
		beforeEach(() => {
			inMemoryRepository.orders = [];
		});
		it('should throw an error', async () => {
			await expect(commandHandler.execute({ id: 'notFoundId' })).rejects.toThrow(
				OrderNotFoundError
			);
		});
	});
});
