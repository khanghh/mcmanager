package params

import "time"

const (
	ServerBodyLimit              = 1 * 1024 * 1024 * 1024 // 1 GiB
	ServerIdleTimeout            = 30 * time.Second
	ServerReadTimeout            = 120 * time.Second
	ServerWriteTimeout           = 120 * time.Second
	ServerRunnerOutputBufferSize = 1024
	ServerRunnerErrorBufferSize  = 1024
	TTYBufferSize                = 4096
	WSClientQueueSize            = 128
)
