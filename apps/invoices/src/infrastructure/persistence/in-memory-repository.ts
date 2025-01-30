import { Invoice } from '@/domain/invoice';
import { InvoiceRepository } from '@/domain/repository';

export class InMemoryInvoiceRepository implements InvoiceRepository {
	public invoices: Invoice[] = [];

	async create(order: Invoice): Promise<void> {
		this.invoices.push(order);
	}

	async findById(id: string): Promise<Invoice | undefined> {
		return this.invoices.find((invoice) => invoice.id === id);
	}

	async findByOrderId(orderId: string): Promise<Invoice | undefined> {
		return this.invoices.find((invoice) => invoice.orderId === orderId);
	}
}
