import { Order } from '@/domain/order';
import { OrderRepository } from '@/domain/repository';

export class InMemoryRepository implements OrderRepository {
	public orders: Order[] = [];

	async create(order: Order): Promise<void> {
		this.orders.push(order);
	}

	async findById(id: string): Promise<Order | undefined> {
		return this.orders.find((order) => order.id === id);
	}

	async list(): Promise<Order[]> {
		return this.orders;
	}

	async update(order: Order): Promise<void> {
		this.orders = this.orders.map((o) => (o.id === order.id ? order : o));
	}
}
