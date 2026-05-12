import React, { useState } from 'react';
import { Anchor } from 'lucide-react';
import WeeklyGridView from './WeeklyGridView';

export default function MaritimeApp() {
  const [userRole] = useState('admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950">
      <header className="bg-slate-900 border-b border-cyan-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center">
            <Anchor className="text-white w-6 h-6" />
          </div>

          <div>
            <h1 className="text-white text-3xl font-bold">
              Planning Maritime
            </h1>

            <p className="text-cyan-200">
              Application prête pour GitHub et Vercel
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6 bg-emerald-900/30 border border-emerald-500/30 text-emerald-100 p-4 rounded-xl">
          Mode actuel : {userRole}
        </div>

        <WeeklyGridView />
      </main>
    </div>
  );
}