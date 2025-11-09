.DEFAULT_GOAL := mcmanager

BUILD_DIR=$(CURDIR)/build/bin
GIT_COMMIT=$(shell git rev-parse HEAD)
GIT_DATE=$(shell git show -s --format=%cI HEAD)
GIT_TAG=$(shell git describe --tags --always --dirty)

LDFLAGS=-ldflags "-w -s -X 'main.gitCommit=$(GIT_COMMIT)' -X 'main.gitDate=$(GIT_DATE)' -X 'main.gitTag=$(GIT_TAG)'"

mcmanager:
	@echo "Building target: $@" 
	go build $(LDFLAGS) -o $(BUILD_DIR)/$@ $(CURDIR)/main.go
	@echo "Done building."

build-docker:
	@echo "Building Docker image: mcmanager:latest" 
	docker build --rm --progress=plain \
		--build-arg GIT_COMMIT=$(GIT_COMMIT) \
		--build-arg GIT_DATE=$(GIT_DATE) \
		--build-arg GIT_TAG=$(GIT_TAG) \
		-t mcmanager:latest \
		-f Dockerfile .
	@echo "Done building."

clean:
	@rm -rf $(BUILD_DIR)/*

all: mcmanager
