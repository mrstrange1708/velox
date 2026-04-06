import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 border-b border-white/5 bg-surface/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
          <h1 className="text-xl font-bold text-white">Overview</h1>
          
          <div className="flex items-center gap-6">
            <button className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary hover:text-primary-hover font-bold text-sm rounded-lg transition-all shadow-[0_0_15px_rgba(255,90,0,0.2)] hover:shadow-[0_0_25px_rgba(255,90,0,0.4)] flex items-center gap-2 cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Open Sandbox
            </button>
            
            <div className="w-px h-6 bg-white/10"></div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-bold text-white group-hover:border-primary/50 transition-colors">
                US
              </div>
              <svg className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
