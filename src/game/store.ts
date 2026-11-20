// Salvataggio locale (solo su questo dispositivo, nessun dato personale): audio e stelle per livello.
const KEY = 'apipro-gioco-v1'
let mem: Record<string, unknown> = {}
try { mem = JSON.parse(localStorage.getItem(KEY) || '{}') } catch { mem = {} }

export const store = {
  get<T>(k: string, d: T): T { return (k in mem ? mem[k] : d) as T },
  set(k: string, v: unknown) {
    mem[k] = v
    try { localStorage.setItem(KEY, JSON.stringify(mem)) } catch { /* modalità privata: resta in memoria */ }
  },
  stars(level: number): number { return this.get<number[]>('stars', [])[level - 1] ?? 0 },
  setStars(level: number, s: number) {
    const arr = [...this.get<number[]>('stars', [])]
    arr[level - 1] = Math.max(arr[level - 1] ?? 0, s)
    this.set('stars', arr)
  }
}
