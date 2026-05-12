import { Ship } from 'lucide-react'
import { formatDay } from '../utils/dateUtils.js'
import { RotationMeta } from './MaritimeApp.jsx'

const statusStyles = {
  'Confirmé': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'À vérifier': 'bg-amber-50 text-amber-700 ring-amber-200',
  'Complet': 'bg-rose-50 text-rose-700 ring-rose-200',
}

export default function WeeklyGridView({ weekDays, rotations }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-white shadow-2xl shadow-black/30">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h2 className="text-2xl font-bold text-slate-950">Vue hebdomadaire</h2>
        <p className="mt-1 text-sm text-slate-500">Rotations prévues par jour avec bateau, trajet, équipage et remplissage.</p>
      </div>

      <div className="grid gap-px bg-slate-200 lg:grid-cols-7">
        {weekDays.map((day, index) => {
          const dayRotations = rotations
            .filter((rotation) => rotation.day === index)
            .sort((a, b) => a.time.localeCompare(b.time))

          return (
            <div key={day.toISOString()} className="min-h-72 bg-white p-4">
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">{formatDay(day)}</p>
                <p className="text-xs text-slate-400">{dayRotations.length} rotation{dayRotations.length > 1 ? 's' : ''}</p>
              </div>

              <div className="space-y-3">
                {dayRotations.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-400">
                    Aucun départ planifié
                  </div>
                ) : (
                  dayRotations.map((rotation) => <RotationCard key={rotation.id} rotation={rotation} />)
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function RotationCard({ rotation }) {
  const occupancy = Math.round((rotation.passengers / rotation.capacity) * 100)

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-slate-950">
            <Ship className="h-4 w-4 text-cyan-600" />
            <h3 className="font-bold">{rotation.boat}</h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">Capitaine : {rotation.captain}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusStyles[rotation.status] || statusStyles['À vérifier']}`}>
          {rotation.status}
        </span>
      </div>

      <RotationMeta rotation={rotation} />

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Remplissage</span>
          <span>{occupancy}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-cyan-500" style={{ width: `${Math.min(occupancy, 100)}%` }} />
        </div>
      </div>

      <p className="mt-3 rounded-lg bg-slate-50 p-2 text-xs text-slate-600">{rotation.note}</p>
    </article>
  )
}
