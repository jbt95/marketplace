import { NotificationService } from '@/domain/notification-service';
import { InvoiceRepository } from '@/domain/repository';
import { z } from 'zod';
import { InvoiceNotFoundError } from './invoice-not-found.error';

const schema = z.object({ orderId: z.string().uuid() });
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
		await this.notificationService.send(invoice);
	}
}
