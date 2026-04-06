export default function StatCard({ 
  title, 
  value, 
  trend, 
  isPositive, 
  icon 
}: { 
  title: string, 
  value: string, 
  trend: string, 
  isPositive: boolean,
  icon: string 
}) {
  return (
    <div className="dev-card p-6 bg-surface/40 hover:bg-surface/60 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-sm text-foreground/50 font-mono">{title}</h4>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
          </svg>
        </div>
      </div>
      <div className="flex items-end gap-4">
        <p className="text-3xl font-black text-white">{value}</p>
        <span className={`text-xs font-bold font-mono py-1 px-2 rounded-md ${isPositive ? 'text-success bg-success/10 border border-success/20' : 'text-red-400 bg-red-400/10 border border-red-400/20'}`}>
          {isPositive ? '+' : ''}{trend}
        </span>
      </div>
    </div>
  );
}
