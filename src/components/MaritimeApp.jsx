import { useMemo, useState } from 'react'
import { Anchor, CalendarDays, ChevronLeft, ChevronRight, Clock, Download, Filter, Gauge, MapPin, Plus, Ship, Users } from 'lucide-react'
import WeeklyGridView from './WeeklyGridView.jsx'
import { addDays, getMonday, getWeekDays } from '../utils/dateUtils.js'

const initialRotations = [
  {
    id: 1,
    day: 0,
    time: '08:30',
    duration: '1h15',
    boat: 'Bateau Vert 1',
    route: 'Port de Saint-Tropez → Sainte-Maxime',
    captain: 'Marc',
    crew: 3,
    passengers: 82,
    capacity: 110,
    status: 'Confirmé',
    note: 'Départ quai A',
  },
  {
    id: 2,
    day: 0,
    time: '10:00',
    duration: '45 min',
    boat: 'Bateau Vert 2',
    route: 'Sainte-Maxime → Port Grimaud',
    captain: 'Laura',
    crew: 2,
    passengers: 56,
    capacity: 95,
    status: 'Confirmé',
    note: 'Prévoir contrôle billet groupe',
  },
  {
    id: 3,
    day: 1,
    time: '09:15',
    duration: '1h30',
    boat: 'Azur Express',
    route: 'Saint-Raphaël → Saint-Tropez',
    captain: 'Nicolas',
    crew: 4,
    passengers: 118,
    capacity: 140,
    status: 'À vérifier',
    note: 'Météo à confirmer',
  },
  {
    id: 4,
    day: 2,
    time: '11:30',
    duration: '50 min',
    boat: 'Bateau Vert 3',
    route: 'Saint-Tropez → Les Marines',
    captain: 'Sarah',
    crew: 2,
    passengers: 44,
    capacity: 80,
    status: 'Confirmé',
    note: 'Rotation standard',
  },
  {
    id: 5,
    day: 3,
    time: '14:00',
    duration: '2h00',
    boat: 'Croisière Golfe',
    route: 'Tour du Golfe',
    captain: 'Marc',
    crew: 5,
    passengers: 132,
    capacity: 160,
    status: 'Complet',
    note: 'Accueil 13:30',
  },
  {
    id: 6,
    day: 4,
    time: '17:45',
    duration: '1h00',
    boat: 'Bateau Vert 1',
    route: 'Sainte-Maxime → Saint-Tropez',
    captain: 'Laura',
    crew: 3,
    passengers: 71,
    capacity: 110,
    status: 'Confirmé',
    note: 'Retour soirée',
  },
  {
    id: 7,
    day: 5,
    time: '19:30',
    duration: '1h45',
    boat: 'Azur Express',
    route: 'Sortie coucher de soleil',
    captain: 'Nicolas',
    crew: 4,
    passengers: 96,
    capacity: 140,
    status: 'À vérifier',
    note: 'Dépend des conditions météo',
  },
]

const boats = ['Tous les bateaux', 'Bateau Vert 1', 'Bateau Vert 2', 'Bateau Vert 3', 'Azur Express', 'Croisière Golfe']
const statuses = ['Tous les statuts', 'Confirmé', 'À vérifier', 'Complet']

export default function MaritimeApp() {
  const [weekStart, setWeekStart] = useState(getMonday(new Date()))
  const [boatFilter, setBoatFilter] = useState('Tous les bateaux')
  const [statusFilter, setStatusFilter] = useState('Tous les statuts')
  const [rotations, setRotations] = useState(initialRotations)

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart])

  const filteredRotations = rotations.filter((rotation) => {
    const boatOk = boatFilter === 'Tous les bateaux' || rotation.boat === boatFilter
    const statusOk = statusFilter === 'Tous les statuts' || rotation.status === statusFilter
    return boatOk && statusOk
  })

  const totalPassengers = filteredRotations.reduce((sum, rotation) => sum + rotation.passengers, 0)
  const totalCapacity = filteredRotations.reduce((sum, rotation) => sum + rotation.capacity, 0)
  const occupancy = totalCapacity ? Math.round((totalPassengers / totalCapacity) * 100) : 0
  const uniqueBoats = new Set(filteredRotations.map((rotation) => rotation.boat)).size

  const addDemoRotation = () => {
    const nextId = Math.max(...rotations.map((rotation) => rotation.id)) + 1
    setRotations([
      ...rotations,
      {
        id: nextId,
        day: nextId % 7,
        time: '16:15',
        duration: '1h10',
        boat: 'Bateau Vert 2',
        route: 'Port de Saint-Tropez → Sainte-Maxime',
        captain: 'Équipe planning',
        crew: 3,
        passengers: 38,
        capacity: 95,
        status: 'À vérifier',
        note: 'Nouvelle rotation exemple',
      },
    ])
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-cyan-900/60 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 shadow-lg shadow-cyan-950/40">
              <Anchor className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Exploitation maritime</p>
              <h1 className="text-3xl font-bold text-white md:text-4xl">Planning Maritime</h1>
              <p className="mt-1 text-sm text-slate-300">Gestion hebdomadaire des rotations, bateaux et équipages</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addDemoRotation}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-400"
            >
              <Plus className="h-5 w-5" />
              Ajouter une rotation
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-200 transition hover:bg-slate-900"
            >
              <Download className="h-5 w-5" />
              Exporter
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard icon={CalendarDays} label="Rotations" value={filteredRotations.length} detail="sur la semaine" />
          <StatCard icon={Users} label="Passagers" value={totalPassengers} detail="réservations prévues" />
          <StatCard icon={Ship} label="Bateaux actifs" value={uniqueBoats} detail="unités planifiées" />
          <StatCard icon={Gauge} label="Remplissage" value={`${occupancy}%`} detail="capacité utilisée" />
        </section>

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/20">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3 text-slate-200">
              <Filter className="h-5 w-5 text-cyan-300" />
              <span className="font-semibold">Filtres du planning</span>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <select
                value={boatFilter}
                onChange={(event) => setBoatFilter(event.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              >
                {boats.map((boat) => (
                  <option key={boat}>{boat}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>

              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 p-1">
                <button
                  type="button"
                  onClick={() => setWeekStart(addDays(weekStart, -7))}
                  className="rounded-lg p-2 hover:bg-slate-800"
                  aria-label="Semaine précédente"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="min-w-52 px-3 text-center text-sm font-semibold text-slate-200">
                  Semaine du {weekStart.toLocaleDateString('fr-FR')}
                </div>
                <button
                  type="button"
                  onClick={() => setWeekStart(addDays(weekStart, 7))}
                  className="rounded-lg p-2 hover:bg-slate-800"
                  aria-label="Semaine suivante"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <WeeklyGridView weekDays={weekDays} rotations={filteredRotations} />
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{detail}</p>
        </div>
        <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-300">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

export function RotationMeta({ rotation }) {
  return (
    <div className="mt-3 grid gap-2 text-xs text-slate-600">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-cyan-600" />
        {rotation.time} · {rotation.duration}
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-cyan-600" />
        {rotation.route}
      </div>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-cyan-600" />
        {rotation.passengers}/{rotation.capacity} passagers · équipage {rotation.crew}
      </div>
    </div>
  )
}
