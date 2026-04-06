import StatCard from '@/components/dashboard/StatCard';

export default function DashboardOverview() {
  return (
    <>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Executions" 
          value="0" 
          trend="0%" 
          isPositive={true} 
          icon="M13 10V3L4 14h7v7l9-11h-7z" 
        />
        <StatCard 
          title="Avg Latency" 
          value="--ms" 
          trend="0%" 
          isPositive={true} 
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
        <StatCard 
          title="Success Rate" 
          value="--%" 
          trend="0%" 
          isPositive={true} 
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
        <StatCard 
          title="Active Workers" 
          value="0" 
          trend="0" 
          isPositive={false} 
          icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
        />
      </div>

      {/* Main Charts & Activity section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Faux Graph */}
        <div className="lg:col-span-2 dev-card p-6 bg-surface/40 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Execution Volume</h3>
            <select className="bg-black border border-white/10 text-xs text-white/70 px-3 py-1.5 rounded-md outline-none">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[240px] relative mt-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-full h-px bg-white/5"></div>
              ))}
            </div>
            
            <div className="absolute inset-x-0 bottom-0 h-full flex items-center justify-center z-10 pointer-events-none">
              <div className="text-center">
                <svg className="w-8 h-8 text-white/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-sm font-medium text-white/50">No execution data available</p>
                <p className="text-xs text-white/30 mt-1 font-mono">Run your first job to see analytics</p>
              </div>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-surface pointer-events-none"></div>
          </div>
        </div>

        {/* Recent Computations List */}
        <div className="dev-card p-0 bg-surface/40 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-bold text-white">Recent Computations</h3>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <svg className="w-8 h-8 text-white/20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium text-white/50">No computations yet</p>
            <p className="text-xs text-white/30 mt-1 font-mono">Jobs will appear here as they run</p>
          </div>
        </div>
      </div>
    </>
  );
}
