import { Invoice, MarshalledInvoice } from '@/domain/invoice';
import { InvoiceRepository } from '@/domain/repository';
import {
	AttributeValue,
	DynamoDBClient,
	DynamoDBClientConfig,
	PutItemCommand,
	QueryCommand
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

interface DynamoDbInvoice extends MarshalledInvoice {
	pk: string;
	sk: string;
	_: string;
}

export class DynamoDBRepository implements InvoiceRepository {
	private static readonly tableName = 'invoices';

	private static readonly config: DynamoDBClientConfig = {
		endpoint: 'http://localhost:8000',
		region: 'eu-central-1',
		credentials: {
			accessKeyId: 'secret',
			secretAccessKey: 'secret'
		},
		logger: console
	};

	private readonly client = new DynamoDBClient(DynamoDBRepository.config);

	private static marshall(invoice: Invoice): Record<string, AttributeValue> {
		return marshall(
			{
				...invoice.toJSON(),
				_: '_',
				pk: invoice.id,
				sk: invoice.created_at.toISOString()
			},
			{ removeUndefinedValues: true }
		);
	}

	private static unmarshall(invoice: DynamoDbInvoice): Invoice {
		return Object.create(Invoice.prototype, {
			id: { value: invoice.pk, writable: false },
			created_at: { value: new Date(invoice.sk), writable: false },
			url: { value: invoice.url, writable: false },
			sentAt: { value: invoice.sent_at ? new Date(invoice.sent_at) : undefined, writable: true },
			orderId: { value: invoice.order_id, writable: false }
		});
	}

	async create(order: Invoice): Promise<void> {
		await this.client.send(
			new PutItemCommand({
				TableName: DynamoDBRepository.tableName,
				ExpressionAttributeNames: { '#pk': 'pk' },
				ExpressionAttributeValues: marshall({ ':pk': order.id }),
				ConditionExpression: '#pk<>:pk',
				Item: DynamoDBRepository.marshall(order)
			})
		);
	}

	async findById(id: string): Promise<Invoice | undefined> {
		return this.client
			.send(
				new QueryCommand({
					TableName: DynamoDBRepository.tableName,
					ExpressionAttributeNames: { '#pk': 'pk' },
					ExpressionAttributeValues: marshall({ ':pk': id }),
					KeyConditionExpression: '#pk = :pk'
				})
			)
			.then((res) => {
				if ((res.Items?.length ?? 0) > 0) {
					return DynamoDBRepository.unmarshall(unmarshall(res.Items?.at(0)!) as DynamoDbInvoice);
				}
				return undefined;
			});
	}

	async findByOrderId(orderId: string): Promise<Invoice | undefined> {
		return this.client
			.send(
				new QueryCommand({
					TableName: DynamoDBRepository.tableName,
					IndexName: 'byOrderId',
					ExpressionAttributeNames: { '#pk': 'order_id' },
					ExpressionAttributeValues: marshall({ ':pk': orderId }),
					KeyConditionExpression: '#pk = :pk'
				})
			)
			.then((res) => {
				if ((res.Items?.length ?? 0) > 0) {
					return DynamoDBRepository.unmarshall(unmarshall(res.Items?.at(0)!) as DynamoDbInvoice);
				}
				return undefined;
			});
	}
}
