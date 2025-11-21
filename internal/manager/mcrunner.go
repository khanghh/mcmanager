package manager

import (
	"context"
	"fmt"

	"github.com/khanghh/mcrunner/pkg/api"
	pb "github.com/khanghh/mcrunner/pkg/proto"
)

type MCRunnerClient struct {
	name   string
	client *api.MCRunnerGRPC

	// console output and input
	buffer   *ringBuffer
	cmdInput chan []byte

	// event handlers
	onError  func(err *RunnerError)
	onOutput func(data []byte)
	onStatus func(status RunnerStatus)
	onState  func(state *ServerState)

	state *ServerState
	// control
	cancelStream func()
	closed       chan struct{}
}

func (m *MCRunnerClient) Name() string {
	return m.name
}

func (m *MCRunnerClient) StartServer(ctx context.Context) error {
	return m.client.StartServer(ctx)
}

func (m *MCRunnerClient) StopServer(ctx context.Context) error {
	return m.client.StopServer(ctx)
}

func (m *MCRunnerClient) KillServer(ctx context.Context) error {
	return m.client.KillServer(ctx)
}

func (m *MCRunnerClient) RestartServer(ctx context.Context) error {
	return m.client.RestartServer(ctx)
}

func (m *MCRunnerClient) SendCommand(ctx context.Context, cmd string) error {
	return m.client.SendCommand(ctx, cmd)
}

func (m *MCRunnerClient) ConsoleSnapshot() []byte {
	return m.buffer.Snapshot()
}

func (m *MCRunnerClient) WriteConsole(data []byte) error {
	select {
	case m.cmdInput <- data:
		return nil
	case <-m.closed:
		return ErrServerConnectionClosed
	}
}

func (m *MCRunnerClient) ResizePTY(ctx context.Context, rows, cols int) error {
	return m.client.ResizeConsole(ctx, rows, cols)
}

func (m *MCRunnerClient) handleConsoleMessage(msg *pb.ConsoleMessage) {
	switch payload := msg.Payload.(type) {
	case *pb.ConsoleMessage_PtyError:
		errCode := payload.PtyError.GetCode()
		errMsg := payload.PtyError.GetMessage()
		fmt.Println("console error:", errCode, errMsg)
		if m.onError != nil {
			m.onError(mapMCRunnerGRPCError(errCode, errMsg))
		}
	case *pb.ConsoleMessage_PtyBuffer:
		data := payload.PtyBuffer.GetData()
		m.buffer.Write(data)
		if m.onOutput != nil {
			m.onOutput(data)
		}
	case *pb.ConsoleMessage_PtyStatus:
		statusCode := payload.PtyStatus.GetStatus()
		if m.onStatus != nil {
			switch statusCode {
			case pb.Status_STATUS_RUNNING:
				m.onStatus(RunnerStatusRunning)
			case pb.Status_STATUS_STOPPING:
				m.onStatus(RunnerStatusStopping)
			case pb.Status_STATUS_STOPPED:
				m.onStatus(RunnerStatusStopped)
			default:
				m.onStatus(RunnerStatusUnknown)
			}
		}
	}
}

func (m *MCRunnerClient) streamConsole(ctx context.Context) error {
	send := make(chan *pb.ConsoleMessage)
	receive := make(chan *pb.ConsoleMessage)
	defer close(send)
	go m.client.StreamConsole(ctx, send, receive)
	for {
		select {
		case msg := <-receive:
			m.handleConsoleMessage(msg)
		case data := <-m.cmdInput:
			send <- NewPtyBufferMessage(data)
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

func (m *MCRunnerClient) streamState(ctx context.Context) {
	receive := make(chan *pb.ServerState)
	go m.client.StreamState(ctx, receive)
	for {
		select {
		case state := <-receive:
			m.state = toServerState(state)
			if m.onState != nil {
				m.onState(m.state)
			}
		case <-ctx.Done():
			return
		}
	}
}

func (m *MCRunnerClient) OnError(fn func(err *RunnerError)) {
	m.onError = fn
}

func (m *MCRunnerClient) OnOutput(fn func(data []byte)) {
	m.onOutput = fn
}

func (m *MCRunnerClient) OnStatus(fn func(status RunnerStatus)) {
	m.onStatus = fn
}

func (m *MCRunnerClient) OnState(fn func(state *ServerState)) {
	m.onState = fn
}

// Close stops all streams and closes the underlying gRPC connection.
func (m *MCRunnerClient) Close() error {
	close(m.closed)
	m.cancelStream()
	return m.client.Close()
}

func NewMCRunnerClient(name string, runnerURL string) (*MCRunnerClient, error) {
	grpcClient, err := api.NewMCRunnerGRPC(runnerURL)
	if err != nil {
		return nil, err
	}

	streamCtx, cancel := context.WithCancel(context.Background())
	client := &MCRunnerClient{
		name:         name,
		client:       grpcClient,
		buffer:       newRingBuffer(1 << 20),
		cmdInput:     make(chan []byte, 10),
		closed:       make(chan struct{}),
		cancelStream: cancel,
	}
	go client.streamConsole(streamCtx)
	go client.streamState(streamCtx)
	return client, nil
}
