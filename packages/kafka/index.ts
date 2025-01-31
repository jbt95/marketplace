import { Kafka } from "kafkajs";

export const kafkaClient = new Kafka({
	clientId: "marketplace",
	brokers: ["localhost:9092"],
});
