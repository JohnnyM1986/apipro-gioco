import Phaser from 'phaser'
import { W, H, txt, button, panel, fadeTo, iconButton } from '../game/ui'
import { drawBackdrop } from '../game/backdrop'
import { LEVELS, SPECIES, BEE_FACTS } from '../game/data'
import { audio } from '../game/audio'

/** Fine livello: stelle, gocce raccolte e una curiosità ("Lo sapevi?") */
export class LevelEnd extends Phaser.Scene {
  constructor() { super('LevelEnd') }

  create(data: { level: number; stars: number; delivered: number; win: boolean }) {
    const lv = LEVELS[data.level - 1]
    this.cameras.main.fadeIn(400, 250, 247, 241)
    drawBackdrop(this, lv)
    this.add.rectangle(W / 2, H / 2, W, H, 0x262c1f, .3)
    panel(this, W / 2, H / 2 + 10, 1040, 620)
    iconButton(this, 90, 85, 'icoHome', () => fadeTo(this, 'Levels'))

    const title = data.stars === 3 ? 'Perfetto!' : data.stars === 2 ? 'Bel lavoro!' : data.stars === 1 ? 'Ce l’hai fatta!' : 'Quasi! Riproviamo?'
    txt(this, W / 2, 92, `${lv.season} · ${title}`, 50, '#262c1f', 700)

    // stelle che entrano una alla volta
    for (let i = 0; i < 3; i++) {
      const on = i < data.stars
      const s = this.add.image(W / 2 - 130 + i * 130, 190 - (i === 1 ? 14 : 0), on ? 'star' : 'starEmpty').setScale(0)
      this.tweens.add({ targets: s, scale: i === 1 ? 1 : .85, angle: { from: -40, to: 0 }, duration: 500, delay: 300 + i * 350, ease: 'Back.out',
        onStart: () => { if (on) audio.play('star', 1 + i * .15) } })
    }
    this.add.image(W / 2 - 70, 278, 'drop').setScale(.65)
    txt(this, W / 2 + 20, 278, `${data.delivered} / ${lv.target}`, 34, '#5e4a33', 700)

    // Lo sapevi? – una curiosità sulla specie e una sulle api
    const sp = SPECIES[Phaser.Utils.Array.GetRandom(lv.flowers)]
    const box = this.add.graphics()
    box.fillStyle(0xfff4d6, 1).fillRoundedRect(W / 2 - 470, 318, 940, 236, 26)
    const fl = this.add.image(W / 2 - 375, 412, 'fl_' + sp.id).setScale(.62)
    this.tweens.add({ targets: fl, angle: { from: -5, to: 5 }, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
    txt(this, W / 2 - 375, 510, sp.name, 24, '#262c1f', 700)
    txt(this, W / 2 - 270, 346, 'Lo sapevi?', 32, '#d2893c', 700).setOrigin(0, .5)
    txt(this, W / 2 - 270, 380, sp.fact, 25, '#262c1f', 500, { wordWrap: { width: 700 }, align: 'left' }).setOrigin(0, 0)
    txt(this, W / 2 - 270, 472, BEE_FACTS[(data.level - 1) % BEE_FACTS.length], 22, '#5e4a33', 500, { wordWrap: { width: 700 }, align: 'left' }).setOrigin(0, 0)

    const last = data.level === LEVELS.length
    const canGo = data.stars > 0
    button(this, W / 2 - 200, 632, 'RIPROVA', () => fadeTo(this, 'Play', { level: data.level }), { green: true, scale: .72 })
    if (canGo) {
      const nx = button(this, W / 2 + 200, 632, last ? 'DIPLOMA' : 'AVANTI', () =>
        last ? fadeTo(this, 'Final') : fadeTo(this, 'Intro', { level: data.level + 1 }), { scale: .72 })
      this.tweens.add({ targets: nx, scale: .77, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.inOut', delay: 1500 })
    } else {
      txt(this, W / 2 + 200, 632, `Servono almeno ${Math.ceil(lv.target * .6)} gocce`, 26, '#5e4a33', 600)
    }
  }
}
