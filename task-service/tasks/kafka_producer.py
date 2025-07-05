# tasks/kafka_producer.py

import json
import time
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable
from django.conf import settings

producer = None
retries = 5

for attempt in range(retries):
    try:
        producer = KafkaProducer(
            bootstrap_servers=settings.KAFKA_BROKER,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        print("✅ Connected to Kafka.")
        break
    except NoBrokersAvailable:
        print(f"⏳ Kafka not available yet... retrying ({attempt + 1}/{retries})")
        time.sleep(3)

if not producer:
    print("❌ Could not connect to Kafka after retries.")

# ✅ Send function
def send_task_event(event_type, task_data):
    if producer:
        message = {
            'event': event_type,
            'data': task_data
        }
        print("📤 Sending to Kafka:", message)
        producer.send('task-events', message)
        producer.flush()
    else:
        print("❌ Kafka producer is not available — event not sent.")
