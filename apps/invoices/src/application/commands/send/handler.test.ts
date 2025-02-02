import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryInvoiceRepository } from '@/infrastructure/persistence/in-memory-repository';
import { Invoice } from '@/domain/invoice';
import { ZodError } from 'zod';
import { SendInvoiceHandler } from './handler';
import { InMemoryNotificationService } from '@/infrastructure/notifications/in-memory-notification-service';
import { InvoiceNotFoundError } from './invoice-not-found.error';

describe('When sending an invoice', () => {
	const repository = new InMemoryInvoiceRepository();
	const notificationService = new InMemoryNotificationService();
	const handler = new SendInvoiceHandler(notificationService, repository);
	const id = crypto.randomUUID();
	const orderId = crypto.randomUUID();
	const url = 'https://example.com';
	const date = new Date();

	beforeEach(() => {
		repository.invoices = [];
		repository.invoices = [new Invoice(id, orderId, url)];
	});

	it('should send the invoice', async () => {
		await handler.execute({ orderId, date: date.toISOString() });
		const invoice = notificationService.notifications.at(0);
		expect(invoice).toBeInstanceOf(Invoice);
		expect(invoice?.id).toBe(id);
		expect(invoice?.orderId).toBe(orderId);
		expect(invoice?.url).toBe(url);
		expect(invoice?.sentAt).toBeInstanceOf(Date);
	});

	describe('When the invoice does not exist for the order', () => {
		it('should throw an error', async () => {
			await expect(
				handler.execute({ orderId: crypto.randomUUID(), date: date.toISOString() })
			).rejects.toThrow(InvoiceNotFoundError);
		});
	});

	describe('When the orderId doesnt match the UUID format', () => {
		it('should throw an error', async () => {
			await expect(
				handler.execute({ orderId: 'not-a-uuid', date: date.toISOString() })
			).rejects.toThrow(ZodError);
		});
	});
});
