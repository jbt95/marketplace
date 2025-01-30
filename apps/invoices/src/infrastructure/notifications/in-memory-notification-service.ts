import { Invoice } from '@/domain/invoice';
import { NotificationService } from '@/domain/notification-service';

export class InMemoryNotificationService implements NotificationService {
	public notifications: Invoice[] = [];

	async send(invoice: Invoice): Promise<void> {
		this.notifications.push(invoice);
	}
}
