package manager

import (
	"context"
	"fmt"
	"sync"
)

var (
	ErrRunnerNotExist = fmt.Errorf("runner not exists")
)

type MCManagerService struct {
	runners map[string]*MCRunnerClient
}

func (s *MCManagerService) GetRunner(name string) (*MCRunnerClient, error) {
	runner, ok := s.runners[name]
	if !ok {
		return nil, ErrRunnerNotExist
	}
	return runner, nil
}

func (s *MCManagerService) Runners() []*MCRunnerClient {
	runnerList := make([]*MCRunnerClient, 0, len(s.runners))
	for _, runner := range s.runners {
		runnerList = append(runnerList, runner)
	}
	return runnerList
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

func NewMCManagerService(runners map[string]*MCRunnerClient) *MCManagerService {
	return &MCManagerService{
		runners: runners,
	}
}
