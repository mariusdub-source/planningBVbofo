const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const shortMonths = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

export function getMonday(date = new Date()) {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1)
  copy.setDate(diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function addDays(date, daysToAdd) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + daysToAdd)
  return copy
}

export function formatDay(date) {
  return `${days[date.getDay()]} ${date.getDate()} ${shortMonths[date.getMonth()]}`
}

export function getWeekDays(startDate) {
  return Array.from({ length: 7 }, (_, index) => addDays(startDate, index))
}
