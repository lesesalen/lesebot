all:
	@echo 'Run one of the commands (deps, test)'

.PHONY: deps
deps:
	pip install -r requirements.txt -r requirements-dev.txt