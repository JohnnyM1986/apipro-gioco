// Suoni sintetizzati con ZzFX (nessun file audio da scaricare) + musichetta di sottofondo generata.
import { zzfx, ZZFX } from 'zzfx'
import { store } from './store'

type P = (number | undefined)[]
const S: Record<string, P> = {
  sip:     [.6, .05, 880, .01, .02, .08, 0, 1.6, 12, , , , , , , , , .7],
  deliver: [.9, 0, 523, .01, .1, .35, 1, 1.4, , , 260, .07, , , , , .08, .7],
  coin:    [.7, .05, 1046, , .04, .2, 1, 1.8, , , 520, .05],
  hit:     [1, .1, 220, .02, .08, .3, 2, 2.2, -8, , , , , .6, , .2],
  dizzy:   [.6, .1, 330, .05, .3, .4, 0, 1, , , , , .12, , 14],
  click:   [.6, 0, 600, , .02, .05, 1, 2, , , , , , , , , , .5],
  star:    [.8, 0, 1318, .02, .1, .4, 1, 1.5, , , 330, .08, , , , , .1],
  win:     [1, 0, 392, .03, .3, .6, 1, 1.4, , , 196, .12, .12, , , , .12, .8],
  bloom:   [.25, .1, 1600, .01, .02, .1, 0, 2, , , , , , , , , , .4],
  whoosh:  [.4, .1, 160, .05, .1, .2, 4, 1, 4]
}

let musicTimer: number | undefined
let unlocked = false

export const audio = {
  get muted() { return store.get('muted', false) },
  toggle() { store.set('muted', !this.muted); if (this.muted) this.stopMusic(); else this.startMusic() },
  unlock() {
    if (unlocked) return
    unlocked = true
    try { ZZFX.audioContext.resume() } catch { /* nessun audio */ }
  },
  play(name: keyof typeof S, pitch = 1) {
    if (this.muted || !unlocked) return
    try {
      const p = [...S[name]]
      if (pitch !== 1 && typeof p[2] === 'number') p[2] = p[2] * pitch
      zzfx(...(p as number[]))
    } catch { /* ignora */ }
  },
  // Musichetta: arpeggio pentatonico leggero, tipo carillon/marimba
  startMusic() {
    if (this.muted || musicTimer !== undefined) return
    const scale = [523, 587, 659, 784, 880, 1046, 784, 659]
    const bass = [131, 131, 175, 196]
    let step = 0
    const beat = 260
    const tick = () => {
      if (this.muted || !unlocked) return
      try {
        const bar = Math.floor(step / 8) % 4
        if (step % 2 === 0 || Math.random() < .35) {
          const n = scale[(step * 3 + bar * 2) % scale.length]
          zzfx(...([.12, 0, n, .005, .05, .45, 0, 1, , , , , , , , , .15, .3] as number[]))
        }
        if (step % 8 === 0) zzfx(...([.16, 0, bass[bar], .01, .3, .6, 0, 1, , , , , , , , , , .5] as number[]))
      } catch { /* ignora */ }
      step++
    }
    musicTimer = window.setInterval(tick, beat)
  },
  stopMusic() { if (musicTimer !== undefined) { clearInterval(musicTimer); musicTimer = undefined } }
}
