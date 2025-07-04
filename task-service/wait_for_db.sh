#!/bin/sh
echo "⏳ Waiting for PostgreSQL..."

python << END
import time, socket
while True:
    try:
        s = socket.create_connection(("postgres", 5432), timeout=2)
        s.close()
        break
    except:
        time.sleep(1)
END

echo "✅ PostgreSQL is up"
exec "$@"
