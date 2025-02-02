import { CreateTableCommand, DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

export const dynamoDbConfig: DynamoDBClientConfig = {
	endpoint: 'http://localhost:8000',
	region: 'eu-central-1',
	credentials: {
		accessKeyId: 'secret',
		secretAccessKey: 'secret'
	},
	logger: console
};

const client = new DynamoDBClient(dynamoDbConfig);

export const createOrdersTable = async () => {
	const command = new CreateTableCommand({
		TableName: 'orders',
		KeySchema: [
			{ AttributeName: 'pk', KeyType: 'HASH' },
			{ AttributeName: 'sk', KeyType: 'RANGE' }
		],
		AttributeDefinitions: [
			{ AttributeName: 'pk', AttributeType: 'S' },
			{ AttributeName: 'sk', AttributeType: 'S' },
			{ AttributeName: '_', AttributeType: 'S' }
		],
		GlobalSecondaryIndexes: [
			{
				IndexName: 'byCreatedAt',
				KeySchema: [
					{ AttributeName: '_', KeyType: 'HASH' },
					{ AttributeName: 'sk', KeyType: 'RANGE' }
				],
				Projection: { ProjectionType: 'ALL' }
			}
		],
		BillingMode: 'PAY_PER_REQUEST'
	});

	await client.send(command);
};

createOrdersTable()
	.then(() => console.log(`Created table orders`))
	.catch((err) => {
		if (err.code === 'ResourceInUseException') {
			return console.log(`orders table already exists`);
		}
		console.error('Error creating table', err);
	});
