import { CreateTableCommand, DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

export const dynamoDbConfig: DynamoDBClientConfig = {
	endpoint: 'http://localhost:8000',
	region: 'eu-central-1',
	credentials: {
		accessKeyId: 'secret',
		secretAccessKey: 'secret'
	}
};

const client = new DynamoDBClient(dynamoDbConfig);

export const createInvoiceTable = async () => {
	const command = new CreateTableCommand({
		TableName: 'invoices',
		KeySchema: [
			{ AttributeName: 'pk', KeyType: 'HASH' },
			{ AttributeName: 'sk', KeyType: 'RANGE' }
		],
		AttributeDefinitions: [
			{ AttributeName: 'pk', AttributeType: 'S' },
			{ AttributeName: 'sk', AttributeType: 'S' }
		],
		BillingMode: 'PAY_PER_REQUEST'
	});

	await client.send(command);
};

createInvoiceTable()
	.then(() => console.log(`Created table invoices`))
	.catch((err) => {
		if (err.code === 'ResourceInUseException') {
			return console.log(`Invoices table already exists`);
		}
		console.error('Error creating table', err);
	});
