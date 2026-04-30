APP_NAME=checkproof_app
DOCKER_COMPOSE=docker-compose
APP_SERVICE=app
LINTER_SERVICE=lint

## ---------------------------
## GO COMMANDS
## ---------------------------

# Run app locally (without Docker)
run:
	php artisan serve

lint:
	docker exec -it $(APP_NAME) golangci-lint run ./...

# Start dev environment (Air + auto-reload)
dev:
	$(DOCKER_COMPOSE) up --build

# Start dev environment (Air + auto-reload)
up:
	$(DOCKER_COMPOSE) up

# Stop containers
stop:
	$(DOCKER_COMPOSE) down

# Rebuild container with no cache
rebuild:
	$(DOCKER_COMPOSE) build --no-cache

# Restart container
restart:
	$(DOCKER_COMPOSE) down && $(DOCKER_COMPOSE) up --build

# Shell into running container
sh:
	docker exec -it $(APP_NAME) sh

worker-run:
	docker exec -it $(APP_NAME) sh && php artisan queue:work

## ---------------------------
## CLEANUP
## ---------------------------

# Remove Docker images + cache
docker-clean:
	docker system prune -af --volumes