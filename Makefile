run-sandbox-fg: redis
	@node test/sandbox/app.js host=127.0.0.1 port=3150 clientPort=3010 frontend=true serverType=connector

# get a redis instance up (localhost:3434)
redis: kill_redis
	@redis-server ./test/redis.conf; sleep 1
	@redis-cli -p 3434 info > /dev/null

# kill this redis instance (localhost:3434)
kill_redis:
	@-redis-cli -p 3434 shutdown
