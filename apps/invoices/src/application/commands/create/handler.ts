import { Invoice } from '@/domain/invoice';
import { InvoiceRepository } from '@/domain/repository';
import { InvoiceAlreadyExistsError } from './invoice-already-exists.error';
import { z } from 'zod';

const schema = z.object({
	id: z.string().uuid(),
	order_id: z.string().uuid(),
	url: z.string().url()
});

type CreateInvoiceCommand = z.infer<typeof schema>;

export class CreateInvoiceHandler {
	constructor(private readonly repository: InvoiceRepository) {}

	async execute(command: CreateInvoiceCommand): Promise<void> {
		const parsed = schema.parse(command);
		const invoice = await this.repository.findById(parsed.id);
		if (invoice) {
			throw new InvoiceAlreadyExistsError();
		}
		await this.repository.create(new Invoice(parsed.id, parsed.order_id, parsed.url));
	}
}
