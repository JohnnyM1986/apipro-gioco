import Phaser from 'phaser'
import { W, H, txt, button, panel, fadeTo, flutterBee } from '../game/ui'
import { drawBackdrop } from '../game/backdrop'
import { LEVELS, SPECIES } from '../game/data'

/** Scheda di inizio stagione: quali fiori si trovano, quali pericoli, cosa fare */
export class Intro extends Phaser.Scene {
  constructor() { super('Intro') }

  create(data: { level: number }) {
    const lv = LEVELS[data.level - 1]
    this.cameras.main.fadeIn(400, 250, 247, 241)
    drawBackdrop(this, lv)
    this.add.rectangle(W / 2, H / 2, W, H, 0x262c1f, .25)

    const card = this.add.container(0, 40).setAlpha(0)
    card.add(panel(this, W / 2, H / 2, 1000, 600))
    card.add(txt(this, W / 2, 118, `Livello ${lv.id}`, 28, '#d2893c', 700))
    card.add(txt(this, W / 2, 166, lv.season, 64, '#262c1f', 700))
    card.add(txt(this, W / 2, 218, lv.subtitle, 28, '#5f6b5a', 500))

    // fiori della stagione con nome
    card.add(txt(this, W / 2, 268, 'In questa stagione fioriscono:', 24, '#363d2d', 600))
    lv.flowers.forEach((id, i, arr) => {
      const x = W / 2 + (i - (arr.length - 1) / 2) * 190
      const f = this.add.image(x, 340, 'fl_' + id).setScale(0)
      card.add(f)
      card.add(txt(this, x, 410, SPECIES[id].name, 24, '#262c1f', 600))
      this.tweens.add({ targets: f, scale: .5, duration: 500, delay: 350 + i * 120, ease: 'Back.out' })
      this.tweens.add({ targets: f, angle: { from: -5, to: 5 }, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.inOut', delay: i * 200 })
    })

    // consiglio con icona
    const icon = lv.id === 1 ? 'hand' : lv.id === 2 ? 'hornet' : lv.id === 3 ? 'smog' : 'fl_edera'
    const tipBg = this.add.graphics()
    tipBg.fillStyle(0xfff4d6, 1).fillRoundedRect(W / 2 - 440, 446, 880, 100, 24)
    card.add(tipBg)
    const ic = this.add.image(W / 2 - 380, 496, icon).setScale(icon === 'hand' ? .7 : .38)
    card.add(ic)
    this.tweens.add({ targets: ic, y: 488, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
    card.add(txt(this, W / 2 + 40, 496, lv.tip, 24, '#5e4a33', 500, { wordWrap: { width: 740 }, align: 'left' }))

    // obiettivo
    card.add(this.add.image(W / 2 - 250, 606, 'drop').setScale(.8))
    card.add(txt(this, W / 2 - 220, 606, `Porta ${lv.target} gocce all’arnia`, 28, '#262c1f', 600).setOrigin(0, .5))

    const go = button(this, W / 2 + 330, 606, 'VIA!', () => fadeTo(this, 'Play', { level: lv.id }), { scale: .62 })
    card.add(go)
    this.tweens.add({ targets: card, alpha: 1, y: 0, duration: 500, ease: 'Back.out' })
    this.tweens.add({ targets: go, scale: .68, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.inOut', delay: 600 })

    flutterBee(this, 150, 120, .9)
  }
}
