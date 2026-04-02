package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sort"
	"time"
)

type TestCase struct {
	TestCaseID     int    `json:"test_case_id"`
	Input          string `json:"input"`
	ExpectedOutput string `json:"expected_output"`
}

type TestCaseResult struct {
	TestCaseID int    `json:"test_case_id"`
	Status     string `json:"status"`
	TimeMs     int64  `json:"time_ms"`
	MemoryKb   int64  `json:"memory_kb"`
}

type SubmissionRequest struct {
	Language      string     `json:"language"`
	SourceCode    string     `json:"source_code"`
	TestCases     []TestCase `json:"test_cases"`
	TimeLimitMs   int        `json:"time_limit_ms"`
	MemoryLimitKb int        `json:"memory_limit_kb"`
}

type SubmissionResponse struct {
	SubmissionID string           `json:"submission_id"`
	Status       string           `json:"status,omitempty"`
	OverallState string           `json:"overall_state,omitempty"`
	Results      []TestCaseResult `json:"results,omitempty"`
}

type PerformanceMetric struct {
	RequestNumber      int
	Language           string
	SubmitTime         time.Duration    // Time for POST /submit
	FirstPollTime      time.Duration    // Time for first GET /status
	PollCount          int              // Number of polls needed
	TotalPollTime      time.Duration    // Total time spent in all poll requests
	WaitTime           time.Duration    // Time from submit to completion
	RoundTripTime      time.Duration    // Total end-to-end time
	CompilationTime    time.Duration    // Inferred compilation time
	TestCase1ExecTime  time.Duration    // Execution time for test case 1
	TestCase2ExecTime  time.Duration    // Execution time for test case 2
	TestCase3ExecTime  time.Duration    // Execution time for test case 3
	TotalExecTime      time.Duration    // Sum of all test case execution times
	SystemOverhead     time.Duration    // Overhead (WaitTime - TotalExecTime)
	NetworkLatency     time.Duration    // SubmitTime + TotalPollTime
	Success            bool
	ErrorMessage       string
}

const (
	baseURL        = "http://localhost:8080"
	pollInterval   = 100 * time.Millisecond // Faster polling for better granularity
	requestsPerLang = 10                     // Number of sequential requests per language
)

var languageConfigs = []struct {
	Language   string
	SourceCode string
	TestCases  []TestCase
}{
	{
		Language: "cpp",
		SourceCode: `#include <iostream>
#include <vector>
using namespace std;

long long fibonacci(int n) {
    if (n <= 1) return n;
    vector<long long> fib(n + 1);
    fib[0] = 0;
    fib[1] = 1;
    for (int i = 2; i <= n; i++) {
        fib[i] = fib[i-1] + fib[i-2];
    }
    return fib[n];
}

int main() {
    int n;
    while(cin >> n) {
        cout << fibonacci(n) << endl;
    }
    return 0;
}`,
		TestCases: []TestCase{
			{TestCaseID: 1, Input: "10", ExpectedOutput: "55"},
			{TestCaseID: 2, Input: "20", ExpectedOutput: "6765"},
			{TestCaseID: 3, Input: "15", ExpectedOutput: "610"},
		},
	},
	{
		Language: "c",
		SourceCode: `#include <stdio.h>
#include <stdlib.h>

long long fibonacci(int n) {
    if (n <= 1) return n;
    long long *fib = malloc((n + 1) * sizeof(long long));
    fib[0] = 0;
    fib[1] = 1;
    for (int i = 2; i <= n; i++) {
        fib[i] = fib[i-1] + fib[i-2];
    }
    long long result = fib[n];
    free(fib);
    return result;
}

int main() {
    int n;
    while(scanf("%d", &n) != EOF) {
        printf("%lld\n", fibonacci(n));
    }
    return 0;
}`,
		TestCases: []TestCase{
			{TestCaseID: 1, Input: "10", ExpectedOutput: "55"},
			{TestCaseID: 2, Input: "20", ExpectedOutput: "6765"},
			{TestCaseID: 3, Input: "15", ExpectedOutput: "610"},
		},
	},
	{
		Language: "java",
		SourceCode: `import java.util.Scanner;

public class Main {
    public static long fibonacci(int n) {
        if (n <= 1) return n;
        long[] fib = new long[n + 1];
        fib[0] = 0;
        fib[1] = 1;
        for (int i = 2; i <= n; i++) {
            fib[i] = fib[i-1] + fib[i-2];
        }
        return fib[n];
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while(sc.hasNextInt()) {
            int n = sc.nextInt();
            System.out.println(fibonacci(n));
        }
        sc.close();
    }
}`,
		TestCases: []TestCase{
			{TestCaseID: 1, Input: "10", ExpectedOutput: "55"},
			{TestCaseID: 2, Input: "20", ExpectedOutput: "6765"},
			{TestCaseID: 3, Input: "15", ExpectedOutput: "610"},
		},
	},
	{
		Language: "python",
		SourceCode: `def fibonacci(n):
    if n <= 1:
        return n
    fib = [0] * (n + 1)
    fib[1] = 1
    for i in range(2, n + 1):
        fib[i] = fib[i-1] + fib[i-2]
    return fib[n]

import sys
for line in sys.stdin:
    n = int(line.strip())
    print(fibonacci(n))`,
		TestCases: []TestCase{
			{TestCaseID: 1, Input: "10", ExpectedOutput: "55"},
			{TestCaseID: 2, Input: "20", ExpectedOutput: "6765"},
			{TestCaseID: 3, Input: "15", ExpectedOutput: "610"},
		},
	},
	{
		Language: "node",
		SourceCode: `const readline = require('readline');

function fibonacci(n) {
    if (n <= 1) return n;
    const fib = new Array(n + 1);
    fib[0] = 0;
    fib[1] = 1;
    for (let i = 2; i <= n; i++) {
        fib[i] = fib[i-1] + fib[i-2];
    }
    return fib[n];
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    const n = parseInt(line);
    console.log(fibonacci(n));
});`,
		TestCases: []TestCase{
			{TestCaseID: 1, Input: "10", ExpectedOutput: "55"},
			{TestCaseID: 2, Input: "20", ExpectedOutput: "6765"},
			{TestCaseID: 3, Input: "15", ExpectedOutput: "610"},
		},
	},
	{
		Language: "csharp",
		SourceCode: `using System;

class Program
{
    static long Fibonacci(int n)
    {
        if (n <= 1) return n;
        long[] fib = new long[n + 1];
        fib[0] = 0;
        fib[1] = 1;
        for (int i = 2; i <= n; i++)
        {
            fib[i] = fib[i-1] + fib[i-2];
        }
        return fib[n];
    }
    
    static void Main()
    {
        string line;
        while ((line = Console.ReadLine()) != null)
        {
            int n = int.Parse(line);
            Console.WriteLine(Fibonacci(n));
        }
    }
}`,
		TestCases: []TestCase{
			{TestCaseID: 1, Input: "10", ExpectedOutput: "55"},
			{TestCaseID: 2, Input: "20", ExpectedOutput: "6765"},
			{TestCaseID: 3, Input: "15", ExpectedOutput: "610"},
		},
	},
	{
		Language: "ts",
		SourceCode: `import * as readline from 'readline';

function fibonacci(n: number): number {
    if (n <= 1) return n;
    const fib: number[] = new Array(n + 1);
    fib[0] = 0;
    fib[1] = 1;
    for (let i = 2; i <= n; i++) {
        fib[i] = fib[i-1] + fib[i-2];
    }
    return fib[n];
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (line: string) => {
    const n = parseInt(line);
    console.log(fibonacci(n));
});`,
		TestCases: []TestCase{
			{TestCaseID: 1, Input: "10", ExpectedOutput: "55"},
			{TestCaseID: 2, Input: "20", ExpectedOutput: "6765"},
			{TestCaseID: 3, Input: "15", ExpectedOutput: "610"},
		},
	},
}

func main() {
	client := &http.Client{
		Timeout: 60 * time.Second,
	}

	fmt.Printf("╔════════════════════════════════════════════════════════════════╗\n")
	fmt.Printf("║       CONTAINER PERFORMANCE TEST - SEQUENTIAL EXECUTION        ║\n")
	fmt.Printf("╚════════════════════════════════════════════════════════════════╝\n\n")
	fmt.Printf("Configuration:\n")
	fmt.Printf("  Languages:           %d\n", len(languageConfigs))
	fmt.Printf("  Requests per Lang:   %d\n", requestsPerLang)
	fmt.Printf("  Poll Interval:       %v\n", pollInterval)
	fmt.Printf("  Test Cases:          3 (Fibonacci: n=10, n=20, n=15)\n\n")

	allMetrics := make(map[string][]PerformanceMetric)

	// Test each language sequentially
	for _, config := range languageConfigs {
		fmt.Printf("Testing %s...\n", config.Language)
		
		langMetrics := make([]PerformanceMetric, 0, requestsPerLang)
		
		for i := 0; i < requestsPerLang; i++ {
			metric := executeRequest(client, i+1, config.Language, config.SourceCode, config.TestCases)
			langMetrics = append(langMetrics, metric)
			
			status := "✓"
			if !metric.Success {
				status = "✗"
			}
			fmt.Printf("  [%s] Request %2d: Round-trip=%8s  Wait=%8s  Exec=%7s  Overhead=%7s  Polls=%2d\n",
				status, i+1, metric.RoundTripTime, metric.WaitTime, 
				metric.TotalExecTime, metric.SystemOverhead, metric.PollCount)
			
			// Small delay between requests to avoid overwhelming the system
			time.Sleep(200 * time.Millisecond)
		}
		
		allMetrics[config.Language] = langMetrics
		fmt.Printf("\n")
	}

	// Print comprehensive analysis
	printDetailedAnalysis(allMetrics)
}

func executeRequest(client *http.Client, reqNum int, language, sourceCode string, testCases []TestCase) PerformanceMetric {
	metric := PerformanceMetric{
		RequestNumber: reqNum,
		Language:      language,
	}

	payload := SubmissionRequest{
		Language:      language,
		SourceCode:    sourceCode,
		TestCases:     testCases,
		TimeLimitMs:   5000,
		MemoryLimitKb: 262144,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		metric.Success = false
		metric.ErrorMessage = "JSON marshal error: " + err.Error()
		return metric
	}

	// 1. Submit request
	overallStart := time.Now()
	submitStart := time.Now()
	resp, err := client.Post(baseURL+"/submit", "application/json", bytes.NewBuffer(jsonData))
	metric.SubmitTime = time.Since(submitStart)

	if err != nil {
		metric.Success = false
		metric.ErrorMessage = "Submit error: " + err.Error()
		return metric
	}

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusAccepted {
		metric.Success = false
		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		metric.ErrorMessage = fmt.Sprintf("Submit failed with status %d: %s", resp.StatusCode, string(body))
		return metric
	}

	var subResp struct {
		SubmissionID string `json:"submission_id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&subResp); err != nil {
		metric.Success = false
		metric.ErrorMessage = "Failed to decode submit response: " + err.Error()
		resp.Body.Close()
		return metric
	}
	resp.Body.Close()

	// 2. Poll until completion
	firstPoll := true
	waitStart := time.Now()
	
	for {
		time.Sleep(pollInterval)
		
		pollStart := time.Now()
		statusResp, err := client.Get(fmt.Sprintf("%s/status?submission_id=%s", baseURL, subResp.SubmissionID))
		pollDuration := time.Since(pollStart)
		
		if firstPoll {
			metric.FirstPollTime = pollDuration
			firstPoll = false
		}
		
		metric.PollCount++
		metric.TotalPollTime += pollDuration

		if err != nil {
			metric.Success = false
			metric.ErrorMessage = "Poll error: " + err.Error()
			return metric
		}

		if statusResp.StatusCode != http.StatusOK {
			metric.Success = false
			body, _ := io.ReadAll(statusResp.Body)
			statusResp.Body.Close()
			metric.ErrorMessage = fmt.Sprintf("Poll failed with status %d: %s", statusResp.StatusCode, string(body))
			return metric
		}

		var statusData SubmissionResponse
		if err := json.NewDecoder(statusResp.Body).Decode(&statusData); err != nil {
			metric.Success = false
			metric.ErrorMessage = "Poll decode error: " + err.Error()
			statusResp.Body.Close()
			return metric
		}
		statusResp.Body.Close()

		if statusData.Status == "pending" {
			continue
		}

		// Completed!
		metric.WaitTime = time.Since(waitStart)
		metric.RoundTripTime = time.Since(overallStart)
		metric.Success = true

		// Extract execution times for each test case
		for _, res := range statusData.Results {
			execTime := time.Duration(res.TimeMs) * time.Millisecond
			metric.TotalExecTime += execTime
			
			switch res.TestCaseID {
			case 1:
				metric.TestCase1ExecTime = execTime
			case 2:
				metric.TestCase2ExecTime = execTime
			case 3:
				metric.TestCase3ExecTime = execTime
			}
		}

		// Calculate derived metrics
		metric.SystemOverhead = metric.WaitTime - metric.TotalExecTime
		metric.NetworkLatency = metric.SubmitTime + metric.TotalPollTime
		
		// Compilation time is roughly: SystemOverhead - NetworkLatency
		// (time spent in container doing non-execution work)
		metric.CompilationTime = metric.SystemOverhead - metric.NetworkLatency
		if metric.CompilationTime < 0 {
			metric.CompilationTime = 0
		}

		return metric
	}
}

func printDetailedAnalysis(allMetrics map[string][]PerformanceMetric) {
	fmt.Printf("╔════════════════════════════════════════════════════════════════╗\n")
	fmt.Printf("║                  DETAILED PERFORMANCE ANALYSIS                 ║\n")
	fmt.Printf("╚════════════════════════════════════════════════════════════════╝\n\n")

	languages := []string{"cpp", "c", "java", "python", "node", "csharp", "ts"}

	for _, lang := range languages {
		metrics := allMetrics[lang]
		if len(metrics) == 0 {
			continue
		}

		successMetrics := make([]PerformanceMetric, 0)
		for _, m := range metrics {
			if m.Success {
				successMetrics = append(successMetrics, m)
			}
		}

		if len(successMetrics) == 0 {
			fmt.Printf("┌─ %s ─────────────────────────────────────────────────────────┐\n", lang)
			fmt.Printf("│ ⚠️  All requests failed                                       │\n")
			fmt.Printf("└──────────────────────────────────────────────────────────────┘\n\n")
			continue
		}

		fmt.Printf("┌─ %s ─────────────────────────────────────────────────────────┐\n", lang)
		fmt.Printf("│ Success Rate: %d/%d (%.1f%%)                                  │\n",
			len(successMetrics), len(metrics),
			float64(len(successMetrics))/float64(len(metrics))*100)
		fmt.Printf("├──────────────────────────────────────────────────────────────┤\n")

		// Extract timing slices
		roundTrip := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.RoundTripTime })
		waitTime := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.WaitTime })
		submitTime := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.SubmitTime })
		totalExec := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.TotalExecTime })
		overhead := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.SystemOverhead })
		compilation := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.CompilationTime })
		networkLatency := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.NetworkLatency })
		testCase1 := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.TestCase1ExecTime })
		testCase2 := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.TestCase2ExecTime })
		testCase3 := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.TestCase3ExecTime })
		totalPoll := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.TotalPollTime })
		pollCounts := extractInts(successMetrics, func(m PerformanceMetric) int { return m.PollCount })

		// Round-trip time
		printMetricRow("│ Round-Trip Time", roundTrip)
		
		// Wait time (submit to completion)
		printMetricRow("│ Wait Time (Submit→Done)", waitTime)
		
		// Submit POST time
		printMetricRow("│ Submit POST Time", submitTime)
		
		fmt.Printf("├──────────────────────────────────────────────────────────────┤\n")
		
		// Execution breakdown
		printMetricRow("│ Total Execution Time", totalExec)
		printMetricRow("│   • Test Case 1 (n=10)", testCase1)
		printMetricRow("│   • Test Case 2 (n=20)", testCase2)
		printMetricRow("│   • Test Case 3 (n=15)", testCase3)
		
		fmt.Printf("├──────────────────────────────────────────────────────────────┤\n")
		
		// System overhead
		printMetricRow("│ System Overhead", overhead)
		printMetricRow("│   • Compilation Time", compilation)
		printMetricRow("│   • Network Latency", networkLatency)
		
		fmt.Printf("├──────────────────────────────────────────────────────────────┤\n")
		
		// Polling stats
		printMetricRow("│ Total Poll Time", totalPoll)
		fmt.Printf("│ Poll Count:        Avg: %5.1f  Min: %3d  Max: %3d  P50: %3d │\n",
			calculateAvgInt(pollCounts),
			pollCounts[0],
			pollCounts[len(pollCounts)-1],
			pollCounts[len(pollCounts)/2])
		
		fmt.Printf("├──────────────────────────────────────────────────────────────┤\n")
		
		// Breakdown percentages
		avgRoundTrip := calculateAvg(roundTrip)
		avgExec := calculateAvg(totalExec)
		avgOverhead := calculateAvg(overhead)
		avgCompilation := calculateAvg(compilation)
		avgNetwork := calculateAvg(networkLatency)
		
		execPct := float64(avgExec.Nanoseconds()) / float64(avgRoundTrip.Nanoseconds()) * 100
		overheadPct := float64(avgOverhead.Nanoseconds()) / float64(avgRoundTrip.Nanoseconds()) * 100
		compilePct := float64(avgCompilation.Nanoseconds()) / float64(avgRoundTrip.Nanoseconds()) * 100
		networkPct := float64(avgNetwork.Nanoseconds()) / float64(avgRoundTrip.Nanoseconds()) * 100
		
		fmt.Printf("│ Time Breakdown:                                              │\n")
		fmt.Printf("│   • Execution:     %6.2f%%  (%s avg)                    │\n", execPct, avgExec)
		fmt.Printf("│   • Compilation:   %6.2f%%  (%s avg)                    │\n", compilePct, avgCompilation)
		fmt.Printf("│   • Network:       %6.2f%%  (%s avg)                    │\n", networkPct, avgNetwork)
		fmt.Printf("│   • Other Overhead:%6.2f%%                                   │\n", 
			overheadPct - compilePct - networkPct)
		
		fmt.Printf("└──────────────────────────────────────────────────────────────┘\n\n")
	}

	// Comparative summary
	printComparativeSummary(allMetrics, languages)
}

func printComparativeSummary(allMetrics map[string][]PerformanceMetric, languages []string) {
	fmt.Printf("╔════════════════════════════════════════════════════════════════╗\n")
	fmt.Printf("║                    COMPARATIVE SUMMARY                         ║\n")
	fmt.Printf("╚════════════════════════════════════════════════════════════════╝\n\n")

	type LangStats struct {
		Language       string
		AvgRoundTrip   time.Duration
		AvgWait        time.Duration
		AvgExec        time.Duration
		AvgCompilation time.Duration
		AvgOverhead    time.Duration
		SuccessRate    float64
	}

	stats := make([]LangStats, 0)

	for _, lang := range languages {
		metrics := allMetrics[lang]
		if len(metrics) == 0 {
			continue
		}

		successMetrics := make([]PerformanceMetric, 0)
		for _, m := range metrics {
			if m.Success {
				successMetrics = append(successMetrics, m)
			}
		}

		if len(successMetrics) == 0 {
			continue
		}

		roundTrip := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.RoundTripTime })
		waitTime := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.WaitTime })
		totalExec := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.TotalExecTime })
		compilation := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.CompilationTime })
		overhead := extractDurations(successMetrics, func(m PerformanceMetric) time.Duration { return m.SystemOverhead })

		stats = append(stats, LangStats{
			Language:       lang,
			AvgRoundTrip:   calculateAvg(roundTrip),
			AvgWait:        calculateAvg(waitTime),
			AvgExec:        calculateAvg(totalExec),
			AvgCompilation: calculateAvg(compilation),
			AvgOverhead:    calculateAvg(overhead),
			SuccessRate:    float64(len(successMetrics)) / float64(len(metrics)) * 100,
		})
	}

	// Sort by average round-trip time
	sort.Slice(stats, func(i, j int) bool {
		return stats[i].AvgRoundTrip < stats[j].AvgRoundTrip
	})

	fmt.Printf("Ranked by Average Round-Trip Time:\n\n")
	fmt.Printf("┌──────┬────────┬───────────┬──────────┬──────────┬─────────┬─────────┐\n")
	fmt.Printf("│ Rank │  Lang  │ Round-Trip│   Wait   │   Exec   │ Compile │ Success │\n")
	fmt.Printf("├──────┼────────┼───────────┼──────────┼──────────┼─────────┼─────────┤\n")

	for i, s := range stats {
		fmt.Printf("│  %2d  │ %-6s │ %9s │ %8s │ %8s │ %7s │ %5.1f%% │\n",
			i+1, s.Language,
			s.AvgRoundTrip, s.AvgWait, s.AvgExec, s.AvgCompilation,
			s.SuccessRate)
	}
	fmt.Printf("└──────┴────────┴───────────┴──────────┴──────────┴─────────┴─────────┘\n\n")

	// Compilation time ranking
	compilationStats := make([]LangStats, len(stats))
	copy(compilationStats, stats)
	sort.Slice(compilationStats, func(i, j int) bool {
		return compilationStats[i].AvgCompilation < compilationStats[j].AvgCompilation
	})

	fmt.Printf("Ranked by Average Compilation Time:\n\n")
	fmt.Printf("┌──────┬────────┬─────────────┬─────────────────────────────────┐\n")
	fmt.Printf("│ Rank │  Lang  │ Compilation │          Notes                  │\n")
	fmt.Printf("├──────┼────────┼─────────────┼─────────────────────────────────┤\n")

	for i, s := range compilationStats {
		note := ""
		if s.Language == "python" {
			note = "Interpreted (bytecode compile)"
		} else if s.Language == "node" || s.Language == "ts" {
			note = "JIT compilation"
		} else if s.Language == "java" || s.Language == "csharp" {
			note = "Bytecode compilation + JIT"
		} else {
			note = "Native compilation"
		}
		
		fmt.Printf("│  %2d  │ %-6s │ %11s │ %-31s │\n",
			i+1, s.Language, s.AvgCompilation, note)
	}
	fmt.Printf("└──────┴────────┴─────────────┴─────────────────────────────────┘\n\n")
}

func printMetricRow(label string, durations []time.Duration) {
	if len(durations) == 0 {
		return
	}
	
	avg := calculateAvg(durations)
	min := durations[0]
	max := durations[len(durations)-1]
	// p50 := durations[len(durations)/2]
	
	fmt.Printf("%-27s Avg: %7s  Min: %7s  Max: %7s │\n",
		label+":", avg, min, max)
}

func extractDurations(metrics []PerformanceMetric, getter func(PerformanceMetric) time.Duration) []time.Duration {
	durations := make([]time.Duration, len(metrics))
	for i, m := range metrics {
		durations[i] = getter(m)
	}
	sort.Slice(durations, func(i, j int) bool { return durations[i] < durations[j] })
	return durations
}

func extractInts(metrics []PerformanceMetric, getter func(PerformanceMetric) int) []int {
	values := make([]int, len(metrics))
	for i, m := range metrics {
		values[i] = getter(m)
	}
	sort.Ints(values)
	return values
}

func calculateAvg(durations []time.Duration) time.Duration {
	if len(durations) == 0 {
		return 0
	}
	var total int64
	for _, d := range durations {
		total += d.Nanoseconds()
	}
	return time.Duration(total / int64(len(durations)))
}

func calculateAvgInt(values []int) float64 {
	if len(values) == 0 {
		return 0
	}
	var total int
	for _, v := range values {
		total += v
	}
	return float64(total) / float64(len(values))
}