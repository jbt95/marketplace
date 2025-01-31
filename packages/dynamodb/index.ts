import { DynamoDB } from "aws-sdk";

export const dynamoDbConfig: DynamoDB.Types.ClientConfiguration = {
	endpoint: "http://localhost:8000",
	region: "eu-central-1",
	credentials: {
		accessKeyId: "secret",
		secretAccessKey: "secret",
	},
};
