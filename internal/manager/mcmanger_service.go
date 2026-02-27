package manager

import (
	"context"
	"fmt"
	"strings"
	"sync"
)

var (
	ErrRunnerNotExist = fmt.Errorf("runner not exists")
)

type MCManagerService struct {
	runners []*MCRunnerClient
}

func (s *MCManagerService) GetRunner(name string) (*MCRunnerClient, error) {
	for _, runner := range s.runners {
		if strings.EqualFold(runner.Name(), name) {
			return runner, nil
		}
	}
	return nil, ErrRunnerNotExist
}

func (s *MCManagerService) Runners() []*MCRunnerClient {
	return s.runners
}

func (s *MCManagerService) StopAll() error {
	ctx := context.Background()
	errCh := make(chan error, 1)
	wg := sync.WaitGroup{}
	for _, runner := range s.runners {
		wg.Add(1)
		go func(runner *MCRunnerClient) {
			defer wg.Done()
			if err := runner.StopServer(ctx); err != nil {
				select {
				case errCh <- err:
				default:
				}
			}
		}(runner)
	}
	wg.Wait()
	close(errCh)
	return <-errCh
}

func NewMCManagerService(runners []*MCRunnerClient) *MCManagerService {
	return &MCManagerService{
		runners: runners,
	}
}
