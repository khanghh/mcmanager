package manager

import (
	pb "github.com/khanghh/mcrunner/pkg/proto"
)

func NewPtyBufferMessage(data []byte) *pb.ConsoleMessage {
	return &pb.ConsoleMessage{
		Payload: &pb.ConsoleMessage_PtyBuffer{
			PtyBuffer: &pb.PtyBuffer{
				Data: data,
			},
		},
	}
}

func NewPtyResizeMessage(rows, cols int) *pb.ConsoleMessage {
	return &pb.ConsoleMessage{
		Payload: &pb.ConsoleMessage_PtyResize{
			PtyResize: &pb.PtyResize{
				Rows: uint32(rows),
				Cols: uint32(cols),
			},
		},
	}
}

func mapStatus(pbStatus pb.Status) RunnerStatus {
	switch pbStatus {
	case pb.Status_STATUS_RUNNING:
		return RunnerStatusRunning
	case pb.Status_STATUS_STOPPING:
		return RunnerStatusStopping
	case pb.Status_STATUS_STOPPED:
		return RunnerStatusStopped
	default:
		return RunnerStatusUnknown
	}
}

func toServerState(pbState *pb.ServerState) *ServerState {
	return &ServerState{
		Status:      mapStatus(pbState.Status),
		TPS:         pbState.Tps,
		PID:         int(pbState.Pid),
		MemoryUsage: &pbState.MemoryUsage,
		MemoryLimit: &pbState.MemoryLimit,
		CPUUsage:    &pbState.CpuUsage,
		CPULimit:    &pbState.CpuLimit,
		UptimeSec:   pbState.UptimeSec,
	}
}
