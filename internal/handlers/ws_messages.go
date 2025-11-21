package handlers

import (
	"errors"
	"fmt"

	"github.com/khanghh/mcmanager/internal/gen"
	"github.com/khanghh/mcmanager/internal/manager"
)

func NewServerNotExistsError(serverID string) *gen.Message {
	return &gen.Message{
		Type: gen.MessageType_ERROR,
		Payload: &gen.Message_Error{
			Error: &gen.ErrorInfo{
				Code:    "SERVER_NOT_EXISTS",
				Message: fmt.Sprintf("server %s doesn't exists", serverID),
			},
		},
	}
}

func NewInternalServerError(msg string) *gen.Message {
	return &gen.Message{
		Type: gen.MessageType_ERROR,
		Payload: &gen.Message_Error{
			Error: &gen.ErrorInfo{
				Code:    "INTERNAL_SERVER_ERROR",
				Message: msg,
			},
		},
	}
}

func NewCmdOutputMessage(runnerID string, data []byte) *gen.Message {
	return &gen.Message{
		Type: gen.MessageType_CMD_OUTPUT,
		Payload: &gen.Message_CmdOutput{
			CmdOutput: &gen.CmdOutput{
				Id:   runnerID,
				Data: data,
			},
		},
	}
}

func NewServerStatusMessage(runnerID string, status manager.RunnerStatus) *gen.Message {
	return &gen.Message{
		Type: gen.MessageType_CMD_STATUS,
		Payload: &gen.Message_CmdStatus{
			CmdStatus: &gen.CmdStatus{
				Id:     runnerID,
				Status: string(status),
			},
		},
	}
}

func mapRunnerErrorMessage(runnerID string, err error) *gen.Message {
	var code, message string
	if errors.Is(err, manager.ErrServerAlreadyRunning) {
		code = "SERVER_ALREADY_RUNNING"
		message = fmt.Sprintf("%s is already running", runnerID)
	} else if errors.Is(err, manager.ErrServerNotRunning) {
		code = "SERVER_NOT_RUNNING"
		message = fmt.Sprintf("%s is not running", runnerID)
	} else {
		code = "UNKNOWN_SERVER_ERROR"
		message = fmt.Sprintf("%s error: %s", runnerID, err)
	}

	return &gen.Message{
		Type: gen.MessageType_ERROR,
		Payload: &gen.Message_Error{
			Error: &gen.ErrorInfo{
				Code:    code,
				Message: message,
			},
		},
	}
}
