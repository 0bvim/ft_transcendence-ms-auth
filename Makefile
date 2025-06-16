.PHONY: all
all:
	@echo nothing yet

.PHONY: studio
studio:
	@echo "Running prisma studio on web browser..."
	@npm run studio

.PHONY: first_setup
first_setup:
	@echo "Running first setup..."
	@npm install
	@npm run build
	@echo "First setup complete."

.PHONY: migrations
migrations:
	@echo "Running migrations..."
	@npm run db:migrate

gen-migrate-files:
	@echo "Generating migration files..."
	@npx prisma migrate dev --create-only
