.PHONY: all
all:
	@echo nothing yet

# prisma studio is a web interface for managing your database
.PHONY: studio
studio:
	@echo "Running prisma studio on web browser..."
	@npm run db:studio

# if clone this repo for the first time, run this command to set up the project
.PHONY: first_setup
first_setup:
	@echo "Running first setup..."
	@npm install
	@npm run build
	@echo "First setup complete."

# run migrations based on setup in package.json
.PHONY: migrations
migrations:
	@echo "Running migrations..."
	@npm run db:migrate

# generate migration files based on prisma schema changes
gen-migrate-files:
	@echo "Generating migration files..."
	@npx prisma migrate dev --create-only
