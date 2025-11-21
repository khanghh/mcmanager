package manager

type RunnerStatus string

const (
	RunnerStatusUnknown  = "unknown"
	RunnerStatusRunning  = "running"
	RunnerStatusStopping = "stopping"
	RunnerStatusStopped  = "stopped"
)

// ServerState represents the server status response
type ServerState struct {
	Status      RunnerStatus `json:"status"`                // current server status
	TPS         float64      `json:"tps"`                   // ticks per second
	PID         int          `json:"pid,omitempty"`         // process ID
	MemoryUsage *uint64      `json:"memoryUsage,omitempty"` // current memory usage
	MemoryLimit *uint64      `json:"memoryLimit,omitempty"` // max allowed memory (0 = unlimited)
	CPUUsage    *float64     `json:"cpuUsage,omitempty"`    // current CPU usage %
	CPULimit    *float64     `json:"cpuLimit,omitempty"`    // max CPUs allowed
	UptimeSec   uint64       `json:"uptimeSec,omitempty"`   // server uptime in seconds
}
