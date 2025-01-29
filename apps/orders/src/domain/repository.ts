import { Order } from './order';

export interface OrderRepository {
	create(order: Order): Promise<void>;
	findById(id: string): Promise<Order | undefined>;
	list: () => Promise<Order[]>;
	update(order: Order): Promise<void>;
}
