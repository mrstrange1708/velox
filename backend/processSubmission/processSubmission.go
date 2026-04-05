package processSubmission

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/evanw/esbuild/pkg/api"
	"github.com/rishik92/velox/judge"
)

const (
	StatusAccepted             = "Accepted"
	StatusUnsupportedLanguage  = "Unsupported Language"
	StatusCompileError         = "Compile Error"
	StatusSystemErrorWorkspace = "System Error: Cannot create workspace"
	StatusSystemErrorWriteRAM  = "System Error: Cannot write to RAM"

	DefaultTimeLimitMs   = 3000
	DefaultMemoryLimitKb = 256000
)

type SystemError struct {
	msg string
}

func (e *SystemError) Error() string {
	return e.msg
}

type LanguageStrategy interface {
	Prepare(ws Workspace, sourceCode string) (execCmd string, execArgs []string, err error)
}

type BatchRunner interface {
	RunBatch(execCmd string, execArgs []string, testCases []judge.TestCase, timeLimitMs int, memoryLimitKb int) []judge.TestCaseResult
}

type StrategyRegistry interface {
	Get(language string) (LanguageStrategy, bool)
	Register(language string, strategy LanguageStrategy)
}

type DefaultStrategyRegistry struct {
	strategies map[string]LanguageStrategy
}

func NewDefaultRegistry() *DefaultStrategyRegistry {
	r := &DefaultStrategyRegistry{
		strategies: make(map[string]LanguageStrategy),
	}
	r.Register("csharp", &CSharpStrategy{})
	r.Register("c", &CStrategy{})
	r.Register("cpp", &CPPStrategy{})
	r.Register("java", &JavaStrategy{})
	
	// Register the interpreter-based strategies utilizing Composition
	r.Register("python", &PythonStrategy{InterpreterStrategyManager{"python3", ".py"}})
	r.Register("node", &NodeStrategy{InterpreterStrategyManager{"node", ".js"}})
	
	r.Register("ts", &TSStrategy{})
	return r
}

func (r *DefaultStrategyRegistry) Get(language string) (LanguageStrategy, bool) {
	s, exists := r.strategies[language]
	return s, exists
}

func (r *DefaultStrategyRegistry) Register(language string, strategy LanguageStrategy) {
	r.strategies[language] = strategy
}

type SubmissionService struct {
	runner   BatchRunner
	registry StrategyRegistry
	storage  FileStorage
}

func NewSubmissionService(runner BatchRunner, registry StrategyRegistry, storage FileStorage) *SubmissionService {
	return &SubmissionService{
		runner:   runner,
		registry: registry,
		storage:  storage,
	}
}

type CSharpStrategy struct{}

func (s *CSharpStrategy) Prepare(ws Workspace, sourceCode string) (string, []string, error) {
	csprojContent := `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>`

	_, err := ws.WriteFile("project.csproj", []byte(csprojContent))
	if err != nil {
		return "", nil, &SystemError{msg: StatusSystemErrorWriteRAM}
	}
	_, err = ws.WriteFile("Program.cs", []byte(sourceCode))
	if err != nil {
		return "", nil, &SystemError{msg: StatusSystemErrorWriteRAM}
	}

	cmd := exec.Command("dotnet", "build", ws.BaseDir(), "-c", "Release", "-o", ws.GetAbsolutePath("out"), "-v", "q", "--nologo")
	if out, err := cmd.CombinedOutput(); err != nil {
		return "", nil, fmt.Errorf("compile error: %s", string(out))
	}

	return "dotnet", []string{ws.GetAbsolutePath("out/project.dll")}, nil
}

type CStrategy struct{}

func (s *CStrategy) Prepare(ws Workspace, sourceCode string) (string, []string, error) {
	sourcePath, err := ws.WriteFile("solution.c", []byte(sourceCode))
	if err != nil {
		return "", nil, &SystemError{msg: StatusSystemErrorWriteRAM}
	}
	binaryPath := ws.GetAbsolutePath("solution_c")

	cmd := exec.Command("gcc", sourcePath, "-O2", "-o", binaryPath)
	if out, err := cmd.CombinedOutput(); err != nil {
		return "", nil, fmt.Errorf("compile error: %s", string(out))
	}
	return binaryPath, []string{}, nil
}

type CPPStrategy struct{}

func (s *CPPStrategy) Prepare(ws Workspace, sourceCode string) (string, []string, error) {
	sourcePath, err := ws.WriteFile("solution.cpp", []byte(sourceCode))
	if err != nil {
		return "", nil, &SystemError{msg: StatusSystemErrorWriteRAM}
	}
	binaryPath := ws.GetAbsolutePath("solution_cpp")

	cmd := exec.Command("g++", sourcePath, "-O2", "-o", binaryPath)
	if out, err := cmd.CombinedOutput(); err != nil {
		return "", nil, fmt.Errorf("compile error: %s", string(out))
	}
	return binaryPath, []string{}, nil
}

type JavaStrategy struct{}

func (s *JavaStrategy) Prepare(ws Workspace, sourceCode string) (string, []string, error) {
	sourcePath, err := ws.WriteFile("Main.java", []byte(sourceCode))
	if err != nil {
		return "", nil, &SystemError{msg: StatusSystemErrorWriteRAM}
	}

	cmd := exec.Command("javac", sourcePath)
	if out, err := cmd.CombinedOutput(); err != nil {
		return "", nil, fmt.Errorf("compile error: %s", string(out))
	}
	return "java", []string{"-cp", ws.BaseDir(), "Main"}, nil
}

// Composition Pattern / Template Method base for Interpreters
type InterpreterStrategyManager struct {
	Executable string
	FileExt    string
}

func (m *InterpreterStrategyManager) Prepare(ws Workspace, sourceCode string) (string, []string, error) {
	scriptPath, err := ws.WriteFile("solution"+m.FileExt, []byte(sourceCode))
	if err != nil {
		return "", nil, &SystemError{msg: StatusSystemErrorWriteRAM}
	}
	return m.Executable, []string{scriptPath}, nil
}

type PythonStrategy struct {
	InterpreterStrategyManager
}

type NodeStrategy struct {
	InterpreterStrategyManager
}

type TSStrategy struct{}

func (s *TSStrategy) Prepare(ws Workspace, sourceCode string) (string, []string, error) {
	result := api.Transform(sourceCode, api.TransformOptions{
		Loader: api.LoaderTS,
		Format: api.FormatCommonJS,
	})

	if len(result.Errors) > 0 {
		var errMsgs string
		for _, e := range result.Errors {
			errMsgs += e.Text + "\n"
		}
		return "", nil, fmt.Errorf("compile error: %s", errMsgs)
	}

	jsPath, err := ws.WriteFile("solution.js", result.Code)
	if err != nil {
		return "", nil, &SystemError{msg: StatusSystemErrorWriteRAM}
	}
	return "node", []string{jsPath}, nil
}

// ResultAggregator adheres to SRP handling array iterations exclusively
type ResultAggregator struct{}

func (a *ResultAggregator) Aggregate(results []judge.TestCaseResult) string {
	overallState := StatusAccepted
	for _, res := range results {
		if res.Status != StatusAccepted {
			overallState = res.Status
			// Do NOT break here to return specific failed cases transparently
		}
	}
	return overallState
}

// ParseLimits handles resolving sensible bounds
func parseLimits(req *judge.SubmissionRequest) {
	if req.TimeLimitMs <= 0 {
		req.TimeLimitMs = DefaultTimeLimitMs
	}
	if req.MemoryLimitKb <= 0 {
		req.MemoryLimitKb = DefaultMemoryLimitKb
	}
}

func (s *SubmissionService) ProcessSubmission(req judge.SubmissionRequest) judge.SubmissionResponse {
	var execCmd string
	var execArgs []string

	ws, err := s.storage.CreateWorkspace(req.SubmissionID)
	if err != nil {
		return judge.SubmissionResponse{OverallState: StatusSystemErrorWorkspace}
	}
	defer ws.Clean()

	// 1. ROUTING & COMPILATION via Strategy Pattern
	strategy, exists := s.registry.Get(req.Language)
	if !exists {
		return judge.SubmissionResponse{OverallState: StatusUnsupportedLanguage}
	}

	cmd, args, err := strategy.Prepare(ws, req.SourceCode)
	if err != nil {
		if sysErr, ok := err.(*SystemError); ok {
			return judge.SubmissionResponse{OverallState: sysErr.Error()}
		}
		return judge.SubmissionResponse{SubmissionID: req.SubmissionID, OverallState: StatusCompileError, CompileError: err.Error()}
	}

	execCmd = cmd
	execArgs = args

	// 2. APPLYING LIMITS
	parseLimits(&req)

	// 3. CODE EXECUTION
	results := s.runner.RunBatch(execCmd, execArgs, req.TestCases, req.TimeLimitMs, req.MemoryLimitKb)

	// 4. AGGREGATE RESULTS
	aggregator := &ResultAggregator{}
	overallState := aggregator.Aggregate(results)

	return judge.SubmissionResponse{
		SubmissionID: req.SubmissionID,
		OverallState: overallState,
		Results:      results,
	}
}

func CompileInMemoryC(submissionID, sourceCode string) (string, string, error) {
	sourcePath := filepath.Join(os.TempDir(), fmt.Sprintf("solution_%s.c", submissionID))
	binaryPath := filepath.Join(os.TempDir(), fmt.Sprintf("solution_%s_c", submissionID))
	os.WriteFile(sourcePath, []byte(sourceCode), 0644)

	cmd := exec.Command("gcc", sourcePath, "-O2", "-o", binaryPath)
	if out, err := cmd.CombinedOutput(); err != nil {
		return sourcePath, binaryPath, fmt.Errorf("compile error: %s", string(out)) // Cleaned up error formatting
	}
	return sourcePath, binaryPath, nil
}

func CompileInMemoryCPP(submissionID, sourceCode string) (string, string, error) {
	sourcePath := filepath.Join(os.TempDir(), fmt.Sprintf("solution_%s.cpp", submissionID))
	binaryPath := filepath.Join(os.TempDir(), fmt.Sprintf("solution_%s_cpp", submissionID))
	os.WriteFile(sourcePath, []byte(sourceCode), 0644)

	cmd := exec.Command("g++", sourcePath, "-O2", "-o", binaryPath)
	if out, err := cmd.CombinedOutput(); err != nil {
		return sourcePath, binaryPath, fmt.Errorf("compile error: %s", string(out))
	}
	return sourcePath, binaryPath, nil
}

func CompileInMemoryJava(submissionID, sourceCode string) (string, string, error) {
	dirPath := filepath.Join(os.TempDir(), fmt.Sprintf("sol_%s", submissionID))
	os.MkdirAll(dirPath, 0755)
	sourcePath := fmt.Sprintf("%s/Main.java", dirPath)
	os.WriteFile(sourcePath, []byte(sourceCode), 0644)

	cmd := exec.Command("javac", sourcePath)
	if out, err := cmd.CombinedOutput(); err != nil {
		return dirPath, "Main", fmt.Errorf("compile error: %s", string(out))
	}
	return dirPath, "Main", nil
}

func CompileInMemoryTS(submissionID, sourceCode string) (string, string, error) {
	result := api.Transform(sourceCode, api.TransformOptions{
		Loader: api.LoaderTS,
		Format: api.FormatCommonJS,
	})

	if len(result.Errors) > 0 {
		var errMsgs string
		for _, e := range result.Errors {
			errMsgs += e.Text + "\n"
		}
		return "", "", fmt.Errorf("compile error: %s", errMsgs)
	}

	jsPath := filepath.Join(os.TempDir(), fmt.Sprintf("solution_%s.js", submissionID))
	os.WriteFile(jsPath, result.Code, 0644)
	return jsPath, "", nil
}

func CompileInMemoryCSharp(submissionID, sourceCode string) (string, string, error) {
	dirPath := filepath.Join(os.TempDir(), fmt.Sprintf("sol_cs_%s", submissionID))
	os.MkdirAll(dirPath, 0755)

	csprojContent := `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>`
	
	os.WriteFile(dirPath+"/project.csproj", []byte(csprojContent), 0644)
	os.WriteFile(dirPath+"/Program.cs", []byte(sourceCode), 0644)

	cmd := exec.Command("dotnet", "build", dirPath, "-c", "Release", "-o", dirPath+"/out", "-v", "q", "--nologo")
	if out, err := cmd.CombinedOutput(); err != nil {
		return dirPath, dirPath + "/out/project.dll", fmt.Errorf("compile error: %s", string(out))
	}

	return dirPath, dirPath + "/out/project.dll", nil
}