.PHONY: help install dev build test lint clean docker-build docker-up docker-down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies in root and all workspaces
	pnpm install

dev: ## Start all apps in development mode
	pnpm run dev

build: ## Build all apps for production
	pnpm run build

test: ## Run tests for all apps
	pnpm run test

lint: ## Lint all apps
	pnpm run lint

clean: ## Clean all build artifacts and node_modules from root and all workspaces
	@echo "Cleaning node_modules and build artifacts..."
	@rm -rf node_modules
	@rm -rf .turbo
	@rm -f pnpm-lock.yaml package-lock.json
	@find apps -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
	@find apps -type d -name "dist" -exec rm -rf {} + 2>/dev/null || true
	@find packages -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
	@find packages -type d -name "dist" -exec rm -rf {} + 2>/dev/null || true
	@echo "Clean complete!"

docker-build: ## Build Docker image
	docker-compose build

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

# Individual app commands
dev-props: ## Start Props app only
	cd apps/props && pnpm run dev

dev-provide-inject: ## Start Provide/Inject app only
	cd apps/provide-inject && pnpm run dev

dev-composables: ## Start Composables app only
	cd apps/composables && pnpm run dev

dev-pinia: ## Start Pinia app only
	cd apps/pinia && pnpm run dev

dev-vuex: ## Start Vuex app only
	cd apps/vuex && pnpm run dev

dev-rxjs: ## Start RxJS app only
	cd apps/rxjs && pnpm run dev

dev-custom-store: ## Start Custom Store app only
	cd apps/custom-store && pnpm run dev

