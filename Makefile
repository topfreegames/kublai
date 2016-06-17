run-sandbox-fg: redis
	@node tests/sandbox/app.js host=127.0.0.1 port=3334 clientPort=3333 frontend=true serverType=metagame

# get a redis instance up (localhost:3434)
redis: kill_redis
	@redis-server ./tests/redis.conf; sleep 1
	@redis-cli -p 3434 info > /dev/null

# kill this redis instance (localhost:3434)
kill_redis:
	@-redis-cli -p 3434 shutdown

drop-test-khan:
	@psql -d postgres -f tests/drop-test.sql > /dev/null
	@echo "Test database created successfully!"

migrate-test-khan:
	@./bin/khan-darwin migrate -c ./tests/khan.yaml

run-test-khan: kill-test-khan drop-test-khan migrate-test-khan
	@./bin/khan-darwin start -p 8888 -c ./tests/khan.yaml 2>&1 > /tmp/kublai-khan.log &

kill-test-khan:
	@ps aux | egrep './bin/khan' | egrep -v egrep | awk ' { print $$2 } ' | xargs kill -9

run-test-game-server: kill-game-server
	@node tests/sandbox/app.js host=127.0.0.1 port=3334 clientPort=3333 frontend=true serverType=metagame 2>&1 > /tmp/kublai-pomelo.log &
	@sleep 5

kill-game-server:
	@ps aux | egrep 'sandbox/app.js' | egrep -v egrep | awk ' { print $$2 } ' | xargs kill -9

test: run-test-khan run-test-game-server
	@./node_modules/mocha/bin/mocha tests/integration/
