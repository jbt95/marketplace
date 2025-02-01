import { DeleteTableCommand, DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

export const dynamoDbConfig: DynamoDBClientConfig = {
	endpoint: 'http://localhost:8000',
	region: 'eu-central-1',
	credentials: {
		accessKeyId: 'secret',
		secretAccessKey: 'secret'
	}
};

const client = new DynamoDBClient(dynamoDbConfig);

export const deleteOrderTable = async () => {
	await client.send(new DeleteTableCommand({ TableName: 'orders' }));
};

deleteOrderTable()
	.then(() => console.log(`Deleted table orders`))
	.catch((err) => {
		if (err.code === 'ResourceInUseException') {
			return console.log(`orders table already deleted`);
		}
		console.error('Error deleting table', err);
	});
