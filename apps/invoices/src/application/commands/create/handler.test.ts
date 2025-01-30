import { beforeEach, describe, expect, it } from 'vitest';
import { CreateInvoiceHandler } from './handler';
import { InMemoryInvoiceRepository } from '@/infrastructure/persistence/in-memory-repository';
import { Invoice } from '@/domain/invoice';
import { InvoiceAlreadyExistsError } from './invoice-already-exists.error';
import { ZodError } from 'zod';

describe('When creating an invoice', () => {
	const repository = new InMemoryInvoiceRepository();
	const handler = new CreateInvoiceHandler(repository);
	const id = crypto.randomUUID();
	const orderId = crypto.randomUUID();
	const url = 'https://example.com';

	beforeEach(() => {
		repository.invoices = [];
	});

	it('should create an invoice', async () => {
		await handler.execute({ id, orderId, url });
		const invoice = repository.invoices.at(0);
		expect(invoice).toBeInstanceOf(Invoice);
		expect(invoice?.id).toBe(id);
		expect(invoice?.orderId).toBe(orderId);
		expect(invoice?.url).toBe(url);
	});

	describe('When the invoice already exists', () => {
		beforeEach(() => {
			repository.invoices = [new Invoice(id, orderId, url)];
		});
		it('should throw an error', async () => {
			await expect(handler.execute({ id, orderId, url })).rejects.toThrow(
				InvoiceAlreadyExistsError
			);
		});
	});

	describe("When the id doesn't match the UUID format", () => {
		it('should throw an error', async () => {
			await expect(handler.execute({ id: 'not-a-uuid', orderId, url })).rejects.toThrow(ZodError);
		});
	});

	describe('When the orderId doesnt match the UUID format', () => {
		it('should throw an error', async () => {
			await expect(handler.execute({ id, orderId: 'not-a-uuid', url })).rejects.toThrow(ZodError);
		});
	});

	describe('When the url is not a valid url', () => {
		it('should throw an error', async () => {
			await expect(handler.execute({ id, orderId, url: 'not-a-url' })).rejects.toThrow(ZodError);
		});
	});
});
