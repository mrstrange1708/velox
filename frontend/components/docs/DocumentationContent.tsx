import React from 'react';

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
        
        {/* Quick Start Title Injection */}
        <div id="quick-start" className="pt-4 pb-2 border-b border-white/10 scroll-mt-24">
            <h2 className="text-xl font-black text-white/50 uppercase tracking-widest">Quick Start Guide</h2>
        </div>

        {/* Authentication Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(255,90,0,0.1)] shrink-0">1</div>
             <h2 className="text-2xl font-bold text-white tracking-tight">Authentication</h2>
          </div>
          <div className="bg-black/50 p-6 rounded-xl border border-white/5 text-left">
              <p className="text-white/70 mb-4 leading-relaxed">
                  All requests to the execution engine are protected via your project's API Secret. Pass the key dynamically using standard Bearer Token Authentication.
              </p>
              <div className="bg-black/80 rounded border border-white/10 p-4 font-mono text-xs overflow-x-auto text-primary whitespace-nowrap">
                  Authorization: Bearer velox_sk_YOUR_SECRET_KEY
              </div>
          </div>
        </section>

        {/* Dispatch Endpoint Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(255,90,0,0.1)] shrink-0">2</div>
             <h2 className="text-2xl font-bold text-white tracking-tight">Dispatch Job (POST /submit)</h2>
          </div>
          <div className="bg-black/50 p-6 rounded-xl border border-white/5 text-left">
              <p className="text-white/70 mb-4 leading-relaxed">
                  Dispatch source code asynchronously into the container orchestration queue. Returns a temporary Tracker ID that you can use to poll telemetry.
              </p>
              
              <div className="flex gap-2 mb-2">
                 <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Required Payload</span>
              </div>
              <pre className="bg-black/80 rounded border border-white/10 p-4 font-mono text-xs overflow-x-auto text-white/80 whitespace-pre">
{`{
  "language": "cpp",
  "source_code": "#include <iostream>\\nusing namespace std;\\nint main() { cout << \\"Hello World\\" << endl; return 0; }",
  "time_limit": 5000,
  "memory_limit": 512000
}`}
              </pre>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                 <div>
                     <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-2">Capabilities</h3>
                     <ul className="space-y-2 text-sm text-white/70 font-mono list-none p-0 m-0">
                         <li className="flex items-center"><span className="text-primary mr-2">▹</span>C / C++ (GCC 12)</li>
                         <li className="flex items-center"><span className="text-primary mr-2">▹</span>Java (OpenJDK 17)</li>
                         <li className="flex items-center"><span className="text-primary mr-2">▹</span>Python 3.x</li>
                         <li className="flex items-center"><span className="text-primary mr-2">▹</span>Node.js / TypeScript</li>
                         <li className="flex items-center"><span className="text-primary mr-2">▹</span>C# (.NET Core)</li>
                     </ul>
                 </div>
                 <div>
                     <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-2">Constraints</h3>
                     <ul className="space-y-2 text-sm text-white/70 font-mono list-none p-0 m-0">
                         <li className="flex items-center"><span className="text-red-500 mr-2">▹</span>Max Time: 5s (5000ms)</li>
                         <li className="flex items-center"><span className="text-red-500 mr-2">▹</span>Max Memory: 512MB</li>
                         <li className="flex items-center"><span className="text-red-500 mr-2">▹</span>No Network / Disk I/O</li>
                     </ul>
                 </div>
              </div>
          </div>
        </section>

        {/* Polling Endpoint Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(255,90,0,0.1)] shrink-0">3</div>
             <h2 className="text-2xl font-bold text-white tracking-tight">Status Telemetry (GET /status)</h2>
          </div>
          <div className="bg-black/50 p-6 rounded-xl border border-white/5 text-left">
              <p className="text-white/70 mb-4 leading-relaxed">
                  Query the execution queue strictly via the returned <code className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono text-sm">submission_id</code> parameter. Evaluates execution state and returns metrics like compile times, runtime logs, and stdout constraints.
              </p>
              
              <div className="bg-black/80 rounded border border-white/10 p-4 font-mono text-xs overflow-x-auto text-primary mb-4 flex items-center gap-2 whitespace-nowrap">
                 <span className="text-white/50">GET</span> /status?submission_id=123-abc
              </div>

              <div className="mt-4 p-4 border border-primary/20 bg-primary/5 rounded-lg flex flex-col gap-2">
                 <p className="text-white/80 text-sm font-bold">Standard Return Payload</p>
                 <pre className="text-xs text-white/60 font-mono whitespace-pre overflow-x-auto">
{`{
  "submission_id": "123-abc",
  "overall_state": "Accepted",
  "results": null
}`}
                 </pre>
              </div>
          </div>
        </section>

      </div>
    </div>
  );
}
