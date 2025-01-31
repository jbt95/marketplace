import { DynamoDB } from 'aws-sdk';
import { dynamoDbConfig } from '@marketplace/dynamodb';

const dynamodb = new DynamoDB(dynamoDbConfig);

export const createOrdersTable = async () => {
	await dynamodb
		.createTable({
			TableName: 'orders',
			KeySchema: [
				{ AttributeName: 'pk', KeyType: 'HASH' },
				{ AttributeName: 'sk', KeyType: 'RANGE' }
			],
			AttributeDefinitions: [
				{ AttributeName: 'pk', AttributeType: 'S' },
				{ AttributeName: 'sk', AttributeType: 'S' }
			],
			TableClass: 'STANDARD',
			BillingMode: 'PAY_PER_REQUEST'
		})
		.promise()
		.then(() => console.log(`Created table orders`))
		.catch((err) => {
			if (err.code === 'ResourceInUseException') {
				return console.log(`orders already exists`);
			}
			console.error('Error creating table', err);
		});
};
