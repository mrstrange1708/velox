import React, { useState } from 'react';
import api from '@/lib/api';

interface APIKey {
  id: string;
  project: string;
  preview: string;
  createdAt: string;
  scopes: string[];
  expiresAt: string | null;
  lastUsedAt: string | null;
  rawCreatedAt: string;
}

interface APIProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: APIKey;
  stats?: any;
  onUpdate: (newName: string) => void;
}

export default function APIProjectModal({ isOpen, onClose, apiKey, stats, onUpdate }: APIProjectModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(apiKey.project);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!newName.trim() || newName.trim() === apiKey.project) {
        setIsEditing(false);
        return;
    }
    
    setIsSaving(true);
    setError(null);
    try {
        await api.patch(`/auth/api-keys?id=${apiKey.id}`, { name: newName.trim() });
        onUpdate(newName.trim());
        setIsEditing(false);
    } catch (err: any) {
        console.error("Rename failed:", err);
        setError("Failed to rename project.");
    } finally {
        setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
      if (!dateStr) return "Never";
      return new Date(dateStr).toLocaleString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: 'numeric', minute: '2-digit'
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className={`relative bg-[#0a0a0a] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-all ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-2xl rounded-2xl max-h-[90vh]'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-white/[0.02] shrink-0">
            <div className="flex justify-between items-center mb-0">
               <div className="flex items-center gap-3">
                   <h2 className="text-2xl font-bold text-white tracking-tight">{apiKey.project}</h2>
               </div>

               <div className="flex items-center gap-2 shrink-0">
                   <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-white/30 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                        {isFullscreen ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                        )}
                   </button>
                   <button onClick={onClose} className="text-white/30 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg" title="Close">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                   </button>
               </div>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
            
            {/* Identity Module */}
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Project Name</p>
                    {isEditing ? (
                        <div className="w-full">
                            <input 
                                type="text" 
                                value={newName} 
                                onChange={(e) => setNewName(e.target.value)}
                                className="text-lg font-bold bg-black border border-primary/50 text-white rounded-lg px-3 py-1.5 w-full max-w-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-[0_0_15px_rgba(255,90,0,0.1)]"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSave();
                                    if (e.key === 'Escape') {
                                        setNewName(apiKey.project);
                                        setIsEditing(false);
                                    }
                                }}
                            />
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>
                    ) : (
                        <p className="text-lg font-bold text-white tracking-tight">{apiKey.project}</p>
                    )}
                </div>
                <div className="shrink-0 flex gap-2">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={() => { setNewName(apiKey.project); setIsEditing(false); }}
                                className="px-4 py-2 bg-white/5 text-white/50 font-bold text-xs rounded border border-white/5 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="px-5 py-2 bg-primary/20 text-primary font-bold text-xs rounded border border-primary/20 hover:bg-primary/30 transition-colors"
                            >
                                {isSaving ? "Saving..." : "Save Name"}
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-2 bg-white/5 text-white font-bold text-xs rounded border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Rename Project
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Display Hint</p>
                    <p className="text-sm font-mono text-white/80">{apiKey.preview}</p>
                 </div>
                 <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Key ID</p>
                    <p className="text-sm font-mono text-white/80 truncate" title={apiKey.id}>{apiKey.id}</p>
                 </div>
            </div>

            {/* Logs / Stats Module */}
            <div className="mt-2">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3">Live Telemetry Logs</p>
                {stats ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col justify-center">
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Total Requests</p>
                            <p className="text-xl text-white font-black font-mono">{stats.total_requests?.toLocaleString() || 0}</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col justify-center">
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Peak RPM</p>
                            <p className="text-xl text-white font-black font-mono">{stats.peak_rpm?.toLocaleString() || 0}</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col justify-center">
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Success Rate</p>
                            <div className="flex flex-col gap-1.5">
                                <span className={`text-sm font-bold ${stats?.success_rate >= 90 ? 'text-success' : 'text-primary'}`}>
                                    {stats?.success_rate ? stats.success_rate.toFixed(1) : '0.0'}%
                                </span>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                   <div className={`h-full rounded-full transition-all duration-1000 ${stats?.success_rate >= 90 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${stats?.success_rate || 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-white/30 italic">No telemetry data returned for this node.</div>
                )}
            </div>

            {/* Scope Matrix */}
            <div className="mt-2">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3">Authentication Scopes</p>
                <div className="flex gap-2 flex-wrap">
                    {apiKey.scopes && apiKey.scopes.length > 0 ? apiKey.scopes.map(scope => (
                        <span key={scope} className="px-3 py-1 bg-white/5 border border-white/10 text-white/70 text-xs font-mono rounded-full">
                            {scope}
                        </span>
                    )) : (
                        <span className="text-xs text-white/30 italic">No scopes defined</span>
                    )}
                </div>
            </div>

            {/* Dates Matrix */}
            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Created</span>
                    <span className="text-white/80 font-mono text-xs">{formatDate(apiKey.rawCreatedAt)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Expires</span>
                    <span className={`font-mono text-xs ${apiKey.expiresAt ? 'text-primary' : 'text-white/30'}`}>
                        {formatDate(apiKey.expiresAt)}
                    </span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40">Last Auth Signature</span>
                    <span className="text-white/80 font-mono text-xs">{formatDate(apiKey.lastUsedAt)}</span>
                </div>
            </div>
            
        </div>
        
      </div>
    </div>
  );
}
