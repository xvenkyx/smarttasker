const { Kafka } = require('kafkajs');

async function runConsumer(handlerFn) {
  const kafka = new Kafka({
    clientId: 'notification-service',
    brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
  });

  const consumer = kafka.consumer({ groupId: 'notification-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'task-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const parsed = JSON.parse(message.value.toString());
      console.log('📩 Received message:', parsed);
      await handlerFn(parsed); // your notifier logic here
    },
  });
}

module.exports = { runConsumer };
