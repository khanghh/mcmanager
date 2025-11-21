package manager

var (
	ErrServerNotRunning       = NewRunnerError("NOT_RUNNING", "server is not running")
	ErrServerAlreadyRunning   = NewRunnerError("ALREADY_RUNNING", "server is already running")
	ErrServerConnectionClosed = NewRunnerError("CONNECTION_CLOSED", "server connection is closed")
)

type RunnerError struct {
	Code    string
	Message string
}

func (e *RunnerError) Error() string {
	return e.Message
}

func NewRunnerError(code string, message string) *RunnerError {
	return &RunnerError{
		Code:    code,
		Message: message,
	}
}

func mapMCRunnerGRPCError(errCode, errMsg string) *RunnerError {
	switch errCode {
	case "NOT_RUNNING":
		return ErrServerNotRunning
	case "ALREADY_RUNNING":
		return ErrServerAlreadyRunning
	default:
		return &RunnerError{
			Code:    errCode,
			Message: errMsg,
		}
	}
}
