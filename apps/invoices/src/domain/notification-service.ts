import { Invoice } from './invoice';

export interface NotificationService {
	send(invoice: Invoice): Promise<void>;
}
