import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function DocumentationContent() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12 w-full">
      <div id="introduction" className="bg-surface/40 p-8 rounded-2xl border border-white/5 relative overflow-hidden group scroll-mt-24">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-4 relative z-10">Velox Engine Documentation</h1>
        <p className="text-white/60 text-lg leading-relaxed relative z-10">
          Velox is a high-performance, containerized code execution engine (Online Judge) designed for immediate API-driven code compilation and execution. Securely submit source code, execute tests, and track granular telemetry natively through your API keys.
        </p>
      </div>

      <div className="grid gap-8 mt-4">

        {/* Architecture Section */}
        <section id="architecture" className="flex flex-col gap-4 scroll-mt-24">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(255,90,0,0.1)] shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Architecture</h2>
          </div>
          <div className="bg-black/50 p-6 rounded-xl border border-white/5 text-left w-full overflow-hidden">
            <p className="text-white/70 mb-8 leading-relaxed">
              Unlike traditional judging platforms that rely on single monolithic databases to queue and process code submissions, Velox utilizes a deeply decoupled architecture built natively in Go:
            </p>

            {/* Visual Architecture Diagram */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 w-full">

              {/* Gateway Node */}
              <div className="relative group flex-1 w-full md:w-auto">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-surface border border-white/10 rounded-xl p-4 relative z-10 flex flex-col items-center text-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 text-white/80">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <h4 className="font-bold text-white mb-1">API Gateway</h4>
                  <p className="text-xs text-white/50 font-mono">Go / Express</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex text-white/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
              <div className="flex md:hidden text-white/20 rotate-90">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>

              {/* Redis Node */}
              <div className="relative group flex-1 w-full md:w-auto">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-surface border border-red-500/20 rounded-xl p-4 relative z-10 flex flex-col items-center text-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-3 text-red-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                  </div>
                  <h4 className="font-bold text-white mb-1">Queue</h4>
                  <p className="text-xs text-white/50 font-mono">Redis Broker</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex text-white/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
              <div className="flex md:hidden text-white/20 rotate-90">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>

              {/* Worker Node */}
              <div className="relative group flex-1 w-full md:w-auto">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-surface border border-primary/20 rounded-xl p-4 relative z-10 flex flex-col items-center text-center shadow-[0_0_15px_rgba(255,90,0,0.1)]">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 text-primary">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                  </div>
                  <h4 className="font-bold text-white mb-1">Worker Fleet</h4>
                  <p className="text-xs text-white/50 font-mono">Docker Containers</p>
                </div>
              </div>

            </div>

            {/* Detailed Context */}
            <ul className="space-y-4 text-sm text-white/70 mb-0 border-t border-white/5 pt-6">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 shrink-0"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></span>
                <span><strong className="text-white block mb-1">API Gateway</strong> Ingests massive concurrency streams, authenticates API secret tokens synchronously, and pipes payloads into the buffer array.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1 shrink-0"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></span>
                <span><strong className="text-white block mb-1">Redis Queue Broker</strong> Operates strictly as a blazingly fast in-memory task broker ensuring <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs text-primary">0% packet delay</code>. It distributes jobs to the next available worker immediately.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 shrink-0"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></span>
                <span><strong className="text-white block mb-1">Worker Fleet</strong> Instantly spawns secure, isolated Docker sub-containers that execute untrusted code independently using standard Linux namespaces to sandbox memory and disk access.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Execution Lifecycle Section */}
        <section id="execution-lifecycle" className="flex flex-col gap-4 scroll-mt-24 mt-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(255,90,0,0.1)] shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Execution Lifecycle</h2>
          </div>
          <div className="bg-black/50 p-6 rounded-xl border border-white/5 text-left w-full">
            <p className="text-white/70 mb-6 leading-relaxed">
              When a user submits highly untrusted source code through your API, the Velox Engine rigorously isolates the execution while providing near real-time telemetry. The proprietary backend engine utilizes the following secure execution lifecycle:
            </p>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="group border border-white/5 rounded-lg p-5 bg-surface/50 hover:bg-surface transition-colors">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">01</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Payload Orchestration & API Routing</h4>
                    <p className="text-sm text-white/50 leading-relaxed m-0">The API Node validates your Secret Key and parses the required execution payload (Source Code, Constraints, Test Cases). It prepares the execution binaries implicitly depending on the target language environment (e.g., GCC compilation for C++, or Node runtime wrapper for TypeScript).</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group border border-white/5 rounded-lg p-5 bg-surface/50 hover:bg-surface transition-colors">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">02</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Process Trapping (The "Sandbox")</h4>
                    <p className="text-sm text-white/50 leading-relaxed m-0">The core execution is trapped inside isolated OS subprocess bounds. Execution timeout constraints are rigidly enforced via <code className="text-primary bg-primary/10 px-1 rounded font-mono text-xs">Context Timeouts</code>. If a process exceeds its bounds by even a single microsecond, the Engine forcefully halts the thread and signals <code className="text-red-500 bg-red-500/10 px-1 rounded font-mono text-xs">Time Limit Exceeded</code>.</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group border border-white/5 rounded-lg p-5 bg-surface/50 hover:bg-surface transition-colors">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">03</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Sequential STDIN / STDOUT Piping</h4>
                    <p className="text-sm text-white/50 leading-relaxed m-0">The runtime iterates sequentially through the testcase array. For each case, raw `<code className="text-white/80">Input</code>` is piped directly into the binary's standard input stream. The resulting STDOUT is buffered dynamically in memory without disk I/O, ensuring absolute 0ms read latency.</p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="group border border-white/5 rounded-lg p-5 bg-surface/50 hover:bg-surface transition-colors">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">04</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Hardware Heuristics & Verification</h4>
                    <p className="text-sm text-white/50 leading-relaxed m-0">Upon exit, hardware <code className="bg-white/10 text-white/80 px-1 rounded font-mono text-xs">syscall</code> statistics are captured directly from the OS process state to accurately log peak RSS Memory (in KB) and CPU User Time (in MS). The engine then strictly evaluates the buffered STDOUT against the Expected Output for standard <code className="text-success bg-success/10 px-1 rounded font-mono text-xs">Accepted</code> / <code className="text-red-400 bg-red-400/10 px-1 rounded font-mono text-xs">Wrong Answer</code> verdicts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Complete API Flow Injection */}
        <div id="quick-start" className="pt-4 pb-2 border-b border-white/10 scroll-mt-24">
          <h2 className="text-xl font-black text-white/50 uppercase tracking-widest">Integration & API Flow</h2>
        </div>

        {/* Authentication Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(255,90,0,0.1)] shrink-0">1</div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Authentication</h2>
          </div>
          <div className="bg-black/50 p-6 rounded-xl border border-white/5 text-left">
            <p className="text-white/70 mb-4 leading-relaxed">
              All requests to the execution API are strictly protected via your organizational API Secret. Pass the key dynamically using standard Bearer Token Authentication in your HTTP headers.
            </p>
            <div className="bg-black/80 rounded border border-white/10 p-4 font-mono text-xs overflow-x-auto text-primary whitespace-nowrap">
              Authorization: Bearer velox_sk_YOUR_SECRET_KEY
            </div>
          </div>
        </section>

        {/* Dispatch Endpoint Section */}
        <section className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(255,90,0,0.1)] shrink-0">2</div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Dispatch Execution (POST /submit)</h2>
          </div>
          <div className="bg-black/50 p-6 md:p-8 rounded-xl border border-white/5 text-left">
            <p className="text-white/70 mb-6 leading-relaxed">
              Dispatch raw source code asynchronously into the container orchestration queue. The engine instantly acknowledges the request and returns a secure Tracker ID while booting the background sub-container.
            </p>

            <div className="flex flex-col gap-6 mb-8 w-full">
              {/* Request Payload */}
              <div className="w-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">POST Payload</span>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden shadow-[0_0_20px_rgba(255,90,0,0.05)] w-full">
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '1.25rem', background: 'transparent', fontSize: '0.85rem' }}
                  >
                    {`{
  "language": "python",
  "source_code": "import sys\\nprint('Hello ' + sys.stdin.read())",
  "test_cases": [
    { "test_case_id": 1, "input": "World", "expected_output": "Hello World" }
  ],
  "time_limit_ms": 2000,
  "memory_limit_kb": 256000
}`}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Node.js Example */}
              <div className="w-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-white/10 text-white/80 border border-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Example: Node.js (Axios)</span>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden shadow-[0_0_20px_rgba(255,90,0,0.05)] w-full">
                  <SyntaxHighlighter
                    language="javascript"
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '1.25rem', background: 'transparent', fontSize: '0.85rem' }}
                  >
                    {`const axios = require('axios');

const response = await axios.post('https://api.velox.com/submit', {
  language: 'python',
  source_code: 'print("Execution successful!")',
  time_limit_ms: 2000
}, {
  headers: { 'Authorization': 'Bearer velox_sk_YOUR_SECRET_KEY' }
});

console.log('Tracking ID:', response.data.submission_id);`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>

            <div className="p-4 border border-white/10 bg-surface/50 rounded-lg flex flex-col gap-2 w-full">
              <p className="text-white/80 text-sm font-bold uppercase tracking-widest">200 OK Response</p>
              <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden shadow-[0_0_20px_rgba(255,90,0,0.05)] w-full">
                <SyntaxHighlighter
                  language="json"
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '0.85rem' }}
                >
                  {`{
  "message": "Submission received",
  "submission_id": "sub_92kdf81md0",
  "timestamp": "2026-04-13T10:00:00Z"
}`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        {/* Polling Endpoint Section */}
        <section className="flex flex-col gap-4 mt-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(255,90,0,0.1)] shrink-0">3</div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Status Telemetry (GET /status)</h2>
          </div>
          <div className="bg-black/50 p-6 md:p-8 rounded-xl border border-white/5 text-left w-full">
            <p className="text-white/70 mb-6 leading-relaxed">
              Because executions run asynchronously in isolated Docker hardware, you must poll the engine using your returned <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary font-mono text-xs">submission_id</code>. We recommend polling every <strong>500ms</strong> until you receive a terminal lifecycle state.
            </p>

            <div className="bg-black/80 rounded block md:inline-flex border border-white/10 px-5 py-3 font-mono text-sm overflow-x-auto text-primary mb-8 shadow-inner items-center gap-2 whitespace-nowrap w-full md:w-auto">
              <span className="text-white/50 font-bold uppercase tracking-wider text-xs">GET</span> /status?submission_id=sub_92kdf81md0
            </div>

            <div className="flex flex-col gap-8 mb-8 w-full">
              {/* Python Polling Example */}
              <div className="w-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-white/10 text-white/80 border border-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Example: Python Long-Poll</span>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden shadow-[0_0_20px_rgba(255,90,0,0.05)] w-full">
                  <SyntaxHighlighter
                    language="python"
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '1.25rem', background: 'transparent', fontSize: '0.85rem' }}
                  >
                    {`import requests, time

def wait_for_completion(sub_id, api_key):
    while True:
        res = requests.get(
            f"https://api.velox.com/status?submission_id={sub_id}",
            headers={"Authorization": f"Bearer {api_key}"}
        ).json()
        
        # Break out of loop if state is terminal
        if res.get("overall_state") not in ["Pending", "Running"]:
            return res
            
        time.sleep(0.5) # Poll every 500ms`}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Terminal State Definitions */}
              <div className="flex flex-col gap-3 w-full">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-white/10 pb-2">Terminal States Matrix</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-2 rounded bg-success/10 border border-success/20">
                    <span className="text-success font-mono text-xs font-bold">Accepted</span>
                    <span className="text-white/50 text-[10px] uppercase">All STDOUT Matched</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-red-400/10 border border-red-400/20">
                    <span className="text-red-400 font-mono text-xs font-bold">Wrong Answer</span>
                    <span className="text-white/50 text-[10px] uppercase">Mismatch detected</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-orange-400/10 border border-orange-400/20">
                    <span className="text-orange-400 font-mono text-xs font-bold">Time Limit Exceeded</span>
                    <span className="text-white/50 text-[10px] uppercase">SigKill triggered</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-purple-400/10 border border-purple-400/20">
                    <span className="text-purple-400 font-mono text-xs font-bold">Memory Limit Exceeded</span>
                    <span className="text-white/50 text-[10px] uppercase">OOM Killed</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-gray-500/10 border border-gray-500/20">
                    <span className="text-gray-400 font-mono text-xs font-bold">Runtime Error</span>
                    <span className="text-white/50 text-[10px] uppercase">Exception Thrown</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal Resolves */}
            <div className="p-5 border border-white/10 bg-surface/50 rounded-lg flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between">
                <p className="text-white/90 text-sm font-bold uppercase tracking-widest">Final Telemetry Resolution</p>
                <div className="animate-pulse w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_orange]"></div>
              </div>
              <p className="text-xs text-white/60 mb-2">Once the job completes, the <code className="text-primary font-mono bg-black/50 px-1">results</code> array populates with exact microsecond CPU footprints, Kernel Resident Memory spikes, and captured STDERR pipes natively mapped to each isolated test case.</p>
              <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden mt-1 max-h-[300px] overflow-y-auto custom-scrollbar shadow-[0_0_20px_rgba(255,90,0,0.05)] w-full">
                <SyntaxHighlighter
                  language="json"
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '0.75rem' }}
                >
                  {`{
  "submission_id": "sub_92kdf81md0",
  "overall_state": "Accepted",
  "results": [
    {
      "test_case_id": 1,
      "status": "Accepted",
      "expected_output": "Hello World",
      "actual_output": "Hello World",
      "stderr": "",
      "time_ms": 12,
      "memory_kb": 8192
    }
  ]
}`}
                </SyntaxHighlighter>
              </div>
            </div>
            
          </div>
        </section>

      </div>
    </div>
  );
}
