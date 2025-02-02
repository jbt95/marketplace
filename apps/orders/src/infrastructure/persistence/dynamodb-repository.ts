import { MarshalledOrder, Order } from '@/domain/order';
import { OrdersRepository } from '@/domain/repository';
import {
	AttributeValue,
	DynamoDBClient,
	DynamoDBClientConfig,
	PutItemCommand,
	QueryCommand
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

interface DynamoDbOrder extends MarshalledOrder {
	pk: string;
	sk: string;
	_: string;
}

export class DynamoDBRepository implements OrdersRepository {
	private static readonly tableName = 'orders';

	private static readonly config: DynamoDBClientConfig = {
		endpoint: 'http://dynamodb:8000',
		region: 'eu-central-1',
		credentials: {
			accessKeyId: 'secret',
			secretAccessKey: 'secret'
		}
	};

	private readonly client = new DynamoDBClient(DynamoDBRepository.config);

	private static marshall(order: Order): Record<string, AttributeValue> {
		return marshall(
			{
				...order.toJSON(),
				_: '_',
				pk: order.id,
				sk: order.created_at.toISOString()
			},
			{ removeUndefinedValues: true }
		);
	}

	private static unmarshall(order: DynamoDbOrder): Order {
		return Object.create(Order.prototype, {
			id: { value: order.pk, writable: false },
			created_at: { value: new Date(order.sk), writable: false },
			updated_at: {
				value: order.updated_at ? new Date(order.updated_at) : undefined,
				writable: true
			},
			_price: { value: order.price, writable: true },
			_quantity: { value: order.quantity, writable: true },
			_status: { value: order.status, writable: true },
			product_id: { value: order.product_id, writable: false },
			customer_id: { value: order.customer_id, writable: false },
			seller_id: { value: order.seller_id, writable: false }
		});
	}

	async create(order: Order): Promise<void> {
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

	async findById(id: string): Promise<Order | undefined> {
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
					return DynamoDBRepository.unmarshall(unmarshall(res.Items?.at(0)!) as DynamoDbOrder);
				}
				return undefined;
			});
	}

	async list(): Promise<Order[]> {
		return this.client
			.send(
				new QueryCommand({
					TableName: DynamoDBRepository.tableName,
					IndexName: 'byCreatedAt',
					ExpressionAttributeNames: { '#pk': '_', '#sk': 'sk' },
					ExpressionAttributeValues: marshall({ ':pk': '_', ':sk': new Date().toISOString() }),
					KeyConditionExpression: '#pk = :pk AND #sk <= :sk',
					ScanIndexForward: false
				})
			)
			.then(
				(res) =>
					res.Items?.map((item) =>
						DynamoDBRepository.unmarshall(unmarshall(item) as DynamoDbOrder)
					) ?? []
			);
	}

	async update(order: Order): Promise<void> {
		await this.client.send(
			new PutItemCommand({
				TableName: DynamoDBRepository.tableName,
				Item: DynamoDBRepository.marshall(order)
			})
		);
	}
}
