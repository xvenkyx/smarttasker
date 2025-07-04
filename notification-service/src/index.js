const { runConsumer } = require('./consumer');
const { handleTaskEvent } = require('./notifier');
const net = require('net');

const KAFKA_HOST = process.env.KAFKA_BROKER || 'kafka:9092';
const [host, port] = KAFKA_HOST.split(':');

async function waitForKafka(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    console.log(`⏳ Waiting for Kafka... (${i + 1}/${retries})`);
    const isReady = await new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(2000);
      socket.once('error', () => resolve(false));
      socket.once('timeout', () => resolve(false));
      socket.connect(parseInt(port), host, () => {
        socket.end();
        resolve(true);
      });
    });

    if (isReady) {
      console.log('✅ Kafka is available. Starting consumer...');
      return;
    }
    await new Promise((res) => setTimeout(res, delay));
  }
  throw new Error('❌ Kafka did not become ready in time');
}

(async () => {
  try {
    await waitForKafka();
    await runConsumer(handleTaskEvent);
  } catch (err) {
    console.error('❌ Notification service failed to start:', err);
    process.exit(1);
  }
})();
