# Sane defaults
SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
# Default params
# environment ?= "dev"

# ---------------------- COMMANDS ---------------------------


bin = ./node_modules/.bin

build: ## Build the project
	@ rm -rf ./dist
	$(bin)/microbundle build -o dist/ --format cjs,modern
	find ./dist -name "*.d.ts" -exec sh -c 'cp "$$1" "$${1%%.d.ts}.d.mts"' sh {} \;
	find ./dist -name "*.d.ts" -exec sh -c 'cp "$$1" "$${1%%.d.ts}.d.cts"' sh {} \;
	mv ./dist/iti.cjs ./dist/index.cjs
	mv ./dist/iti.cjs.map ./dist/index.cjs.map
	mv ./dist/iti.mjs ./dist/index.mjs
	mv ./dist/iti.mjs.map ./dist/index.mjs.map
	sed -i.bak "s/iti.mjs.map/index.mjs.map/g" ./dist/index.mjs && rm -f ./dist/index.mjs.bak
	sed -i.bak "s/iti.cjs.map/index.cjs.map/g" ./dist/index.cjs && rm -f ./dist/index.cjs.bak
	ls -l ./dist

# https://www.npmjs.com/package/@arethetypeswrong/cli
check: ## Check the project
	make build
	npm pack
	attw ./iti-0.7.0-alpha.4.tgz
# find ./dist -name "*.d.ts" -delete;


# -----------------------------------------------------------
# CAUTION: If you have a file with the same name as make
# command, you need to add it to .PHONY below, otherwise it
# won't work. E.g. `make run` wouldn't work if you have
# `run` file in pwd.
.PHONY: help ssl

# -----------------------------------------------------------
# -----       (Makefile helpers and decoration)      --------
# -----------------------------------------------------------

.DEFAULT_GOAL := help
# check https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences
NC = \033[0m
ERR = \033[31;1m
TAB := '%-20s' # Increase if you have long commands

# tput colors
red := $(shell tput setaf 1)
green := $(shell tput setaf 2)
yellow := $(shell tput setaf 3)
blue := $(shell tput setaf 4)
cyan := $(shell tput setaf 6)
cyan80 := $(shell tput setaf 86)
grey500 := $(shell tput setaf 244)
grey300 := $(shell tput setaf 240)
bold := $(shell tput bold)
underline := $(shell tput smul)
reset := $(shell tput sgr0)

help:
	@printf '\n'
	@printf '    $(underline)$(grey500)Available make commands:$(reset)\n\n'
	@# Print non-check commands with comments
	@grep -E '^([a-zA-Z0-9_-]+\.?)+:.+#.+$$' $(MAKEFILE_LIST) \
		| grep -v '^check-' \
		| grep -v '^env-' \
		| grep -v '^arg-' \
		| sed 's/:.*#/: #/g' \
		| awk 'BEGIN {FS = "[: ]+#[ ]+"}; \
		{printf " $(grey300)   make $(reset)$(cyan80)$(bold)$(TAB) $(reset)$(grey300)# %s$(reset)\n", \
			$$1, $$2}'
	@grep -E '^([a-zA-Z0-9_-]+\.?)+:( +\w+-\w+)*$$' $(MAKEFILE_LIST) \
		| grep -v help \
		| awk 'BEGIN {FS = ":"}; \
		{printf " $(grey300)   make $(reset)$(cyan80)$(bold)$(TAB)$(reset)\n", \
			$$1}'
	@echo -e "\n    $(underline)$(grey500)Helper/Checks$(reset)\n"
	@grep -E '^([a-zA-Z0-9_-]+\.?)+:.+#.+$$' $(MAKEFILE_LIST) \
		| grep -E '^(check|arg|env)-' \
		| awk 'BEGIN {FS = "[: ]+#[ ]+"}; \
		{printf " $(grey300)   make $(reset)$(grey500)$(TAB) $(reset)$(grey300)# %s$(reset)\n", \
			$$1, $$2}'
	@echo -e ""
