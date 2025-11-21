package handlers

import (
	"context"
	"fmt"
	"strings"

	"github.com/khanghh/mcmanager/internal/gen"
	"github.com/khanghh/mcmanager/internal/manager"
	"github.com/khanghh/mcmanager/internal/websocket"
)

type MCManagerHandler struct {
	managerSvc  *manager.MCManagerService
	broadcastCh chan *gen.Message
}

func (h *MCManagerHandler) OnWSClientConnect(cl *websocket.Client) error {
	return nil
}

func (h *MCManagerHandler) OnWSClientDisconnect(cl *websocket.Client) error {
	return nil
}

func (h *MCManagerHandler) HandleCmdInput(cl *websocket.Client, msg *gen.Message) error {
	cmdInput := msg.GetCmdInput()
	runnerID := cmdInput.GetId()
	runner, err := h.managerSvc.GetRunner(runnerID)
	if err != nil {
		return cl.SendMessage(NewServerNotExistsError(runnerID))
	}
	if err := runner.WriteConsole(cmdInput.Data); err != nil {
		return cl.SendMessage(mapRunnerErrorMessage(runnerID, err))
	}
	return nil
}

func (h *MCManagerHandler) HandleCmdResize(cl *websocket.Client, msg *gen.Message) error {
	cmdResize := msg.GetCmdResize()
	rows, cols := int(cmdResize.Rows), int(cmdResize.Cols)
	runnerID := cmdResize.GetId()
	runner, err := h.managerSvc.GetRunner(runnerID)
	if err != nil {
		return cl.SendMessage(NewServerNotExistsError(runnerID))
	}
	return runner.ResizePTY(context.Background(), rows, cols)
}

func (h *MCManagerHandler) StartBroadcast(server *websocket.Server) {
	for _, runner := range h.managerSvc.Runners() {
		runnerTopic := fmt.Sprintf("server:%s", strings.ToLower(runner.Name()))
		topic := server.GetTopic(runnerTopic)
		runner.OnError(func(err *manager.RunnerError) {
			msg := mapRunnerErrorMessage(runner.Name(), err)
			topic.Broadcast(msg)
		})
		runner.OnOutput(func(data []byte) {
			msg := NewCmdOutputMessage(runner.Name(), data)
			topic.Broadcast(msg)
		})
		runner.OnStatus(func(status manager.RunnerStatus) {
			msg := NewServerStatusMessage(runner.Name(), status)
			topic.Broadcast(msg)
		})
		runner.OnState(func(state *manager.ServerState) {
			//TODO: capture server metrics
		})
	}
}

func NewMCManagerHandler(managerSvc *manager.MCManagerService) *MCManagerHandler {
	return &MCManagerHandler{
		managerSvc:  managerSvc,
		broadcastCh: make(chan *gen.Message),
	}
}
