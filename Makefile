# khan
# https://github.com/topfreegames/khan
# Licensed under the MIT license:
# http://www.opensource.org/licenses/mit-license
# Copyright © 2016 Top Free Games <backend@tfgco.com>

OS = $(shell uname | awk '{ print tolower($$0) }')
LFS := $(shell command -v git-lfs 2> /dev/null)

setup-docs:
	@pip install -q --log /tmp/pip.log --no-cache-dir sphinx recommonmark sphinx_rtd_theme

setup-lfs:
	@if [ "$(LFS)" = "" ]; then \
		echo "You don't seem to have Git LFS installed. Installing..."; \
		$(MAKE) setup-lfs-$(OS); \
	fi

setup-lfs-linux:
	@curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
	@sudo apt-get install git-lfs
	@git lfs install

setup-lfs-darwin:
	@brew install git-lfs
	@git lfs install

setup: setup-lfs setup-docs
	@npm install .

setup-ci: setup-lfs
	@npm install .

run-sandbox-fg: redis
	@node tests/sandbox/app.js host=127.0.0.1 port=3334 clientPort=3333 frontend=true serverType=metagame

# get a redis instance up (localhost:3434)
redis: kill-redis
	@redis-server ./tests/redis.conf; sleep 1
	@redis-cli -p 3434 info > /dev/null

# kill this redis instance (localhost:3434)
kill-redis:
	@-redis-cli -p 3434 shutdown

drop-test-khan:
	@echo "Creating test database..."
	@psql -d postgres -f tests/drop-test.sql > /dev/null
	@echo "Test database created successfully!"

migrate-test-khan:
	@echo "Running migrations in $(OS)"
	@./bin/khan-$(OS)-amd64 migrate -c ./tests/khan.yaml

migrate-ci-khan:
	@echo "Running migrations in $(OS)"
	@./bin/khan-$(OS)-amd64 migrate -c ./tests/khan-ci.yaml

run-test-khan: kill-test-khan drop-test-khan migrate-test-khan
	@echo "Running test khan in $(OS)"
	@rm -rf /tmp/kublai-khan.log
	@./bin/khan-$(OS)-amd64 start -p 8888 -c ./tests/khan.yaml 2>&1 > /tmp/kublai-khan.log &

run-ci-khan: kill-test-khan drop-test-khan migrate-ci-khan
	@echo "Running test khan in $(OS)"
	@rm -rf /tmp/kublai-khan.log
	@./bin/khan-$(OS)-amd64 start -p 8888 -c ./tests/khan.yaml 2>&1 > /tmp/kublai-khan.log &

kill-test-khan:
	@-ps aux | egrep './bin/khan' | egrep -v egrep | awk ' { print $$2 } ' | xargs kill -9

run-test-game-server: kill-game-server
	@rm -rf /tmp/kublai-pomelo.log
	@node tests/sandbox/app.js host=127.0.0.1 port=3334 clientPort=3333 frontend=true debug=false serverType=metagame 2>&1 > /tmp/kublai-pomelo.log &
	@sleep 3

kill-game-server:
	@ps aux | egrep 'sandbox/app.js' | egrep -v egrep | awk ' { print $$2 } ' | xargs kill -9

test: redis run-test-khan run-test-game-server run-tests

test-ci: run-ci-khan run-test-game-server run-tests

run-tests:
	@./node_modules/mocha/bin/mocha tests/integration/ || \
	if [ "$$?" -ne "0" ]; then \
		echo "\nKhan log:\n" && \
		cat /tmp/kublai-khan.log && \
		echo "\nPomelo log:\n" && \
		cat /tmp/kublai-pomelo.log && \
		exit 1 ; \
	else \
		exit 0 ; \
	fi

release-npm:
	@npm publish

rtfd:
	@rm -rf docs/_build
	@sphinx-build -b html -d ./docs/_build/doctrees ./docs/ docs/_build/html
	@open docs/_build/html/index.html
