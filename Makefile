all:
	@echo 'Run one of the commands (setup)'

.PHONY: setup
setup:
	python -m venv .venv
	pip install -r requirements.txt
	pre-commit install
