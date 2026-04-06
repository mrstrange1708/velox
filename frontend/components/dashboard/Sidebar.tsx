import Link from 'next/link';

export default function Sidebar() {
  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', active: true },
    { name: 'Executions', href: '/dashboard/executions', icon: 'M13 10V3L4 14h7v7l9-11h-7z', active: false },
    { name: 'API Keys', href: '/dashboard/keys', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', active: false },
    { name: 'Settings', href: '/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', active: false },
  ];

  return (
    <aside className="w-64 h-full border-r border-white/5 bg-surface backdrop-blur-md flex flex-col hidden md:flex">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-white hover:text-primary transition-colors flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface border border-white/10 flex flex-col gap-[2px] items-center justify-center relative overflow-hidden shadow-sm">
             <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
             <div className="flex gap-[3px]">
               <div className="w-[3px] h-[12px] bg-primary rounded-full transform -skew-x-12"></div>
               <div className="w-[3px] h-[12px] bg-white rounded-full transform -skew-x-12"></div>
             </div>
          </div>
          Velox
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${item.active ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(255,90,0,0.1)]' : 'text-foreground/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              {item.name === 'Settings' && <circle cx="12" cy="12" r="3" />}
            </svg>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="bg-black/40 rounded-xl p-4 border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 blur-xl"></div>
           <p className="text-xs text-foreground/50 font-mono mb-2">Workspace Plan</p>
           <p className="text-sm font-bold text-white mb-4">Pro Tier</p>
           <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer">
              Upgrade
           </button>
        </div>
      </div>
    </aside>
  );
}
