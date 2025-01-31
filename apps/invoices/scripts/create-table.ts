import { DynamoDB } from 'aws-sdk';
import { dynamoDbConfig } from '@marketplace/dynamodb';

const dynamodb = new DynamoDB(dynamoDbConfig);

export const createInvoiceTable = async () => {
	await dynamodb
		.createTable({
			TableName: 'invoices',
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
		.then(() => console.log(`Created table invoices`))
		.catch((err) => {
			if (err.code === 'ResourceInUseException') {
				return console.log(`Invoices table already exists`);
			}
			console.error('Error creating table', err);
		});
};
