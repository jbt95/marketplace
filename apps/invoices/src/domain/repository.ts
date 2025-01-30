import { Invoice } from './invoice';

export interface InvoiceRepository {
	create(order: Invoice): Promise<void>;
	findById(id: string): Promise<Invoice | undefined>;
	findByOrderId(orderId: string): Promise<Invoice | undefined>;
}
