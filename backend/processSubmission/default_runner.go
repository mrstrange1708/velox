package processSubmission

import (
	"github.com/rishik92/velox/judge"
	"github.com/rishik92/velox/runBatch"
)

type DefaultRunner struct{}

func (r *DefaultRunner) RunBatch(execCmd string, execArgs []string, testCases []judge.TestCase, timeLimitMs int, memoryLimitKb int) []judge.TestCaseResult {
	return runBatch.RunBatch(execCmd, execArgs, testCases, timeLimitMs, memoryLimitKb)
}
