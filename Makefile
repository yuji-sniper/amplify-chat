# Docker
build:
	docker-compose build

up:
	docker-compose up -d

up-build:
	docker-compose up -d --build

down:
	docker-compose down

prune:
	docker system prune -a --volumes


# コンテナ操作
node:
	docker exec -it node bash


# yarn
yarn-ci:
	docker compose run --rm node yarn install --immutable --immutable-cache --check-cache


# その他
open:
	open http://localhost:3000


# 初回起動
init:
	@make yarn-ci
	@make up-build
	@make open
