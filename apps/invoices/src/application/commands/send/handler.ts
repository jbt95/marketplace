import { NotificationService } from '@/domain/notification-service';
import { InvoiceRepository } from '@/domain/repository';
import { z } from 'zod';
import { InvoiceNotFoundError } from './invoice-not-found.error';

const schema = z.object({ orderId: z.string().uuid(), date: z.string() });
type SendInvoiceCommand = z.infer<typeof schema>;

export class SendInvoiceHandler {
	constructor(
		private notificationService: NotificationService,
		private repository: InvoiceRepository
	) {}

	async execute(command: SendInvoiceCommand): Promise<void> {
		const parsed = schema.parse(command);
		const invoice = await this.repository.findByOrderId(parsed.orderId);
		if (!invoice) {
			throw new InvoiceNotFoundError();
		}
		invoice.sentAt = new Date(parsed.date);
		await Promise.all([this.repository.update(invoice), this.notificationService.send(invoice)]);
	}
}
