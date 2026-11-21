import Phaser from 'phaser'
import { W, H, txt, iconButton, fadeTo, panel } from '../game/ui'
import { drawBackdrop } from '../game/backdrop'
import { LEVELS } from '../game/data'
import { store } from '../game/store'
import { audio } from '../game/audio'

/** Scelta della stagione: quattro schede, ognuna si sblocca con almeno una stella nella precedente */
export class Levels extends Phaser.Scene {
  constructor() { super('Levels') }

  create() {
    this.cameras.main.fadeIn(400, 250, 247, 241)
    drawBackdrop(this, LEVELS[0], 640)
    this.add.rectangle(W / 2, H / 2, W, H, 0xfaf7f1, .35)

    txt(this, W / 2, 80, 'Scegli la stagione', 60, '#ffffff', 700).setStroke('#363d2d', 12)
    iconButton(this, 60, 60, 'icoHome', () => fadeTo(this, 'Title'))
    iconButton(this, W - 60, 60, audio.muted ? 'icoMute' : 'icoSound', (ic) => { audio.toggle(); ic.setTexture(audio.muted ? 'icoMute' : 'icoSound') })

    LEVELS.forEach((lv, i) => {
      const x = 190 + i * 300, y = 390
      const unlocked = i === 0 || store.stars(i) > 0
      const c = this.add.container(x, y + 40).setAlpha(0)
      const g = this.add.graphics()
      g.fillStyle(0x262c1f, .25).fillRoundedRect(-125, -165, 250, 340, 30)
      g.fillStyle(unlocked ? lv.hills[1] : 0xb9b2a3, 1).fillRoundedRect(-130, -175, 260, 340, 30)
      g.fillStyle(0xfaf7f1, 1).fillRoundedRect(-118, -60, 236, 212, 22)
      g.fillStyle(lv.sky[0], 1).fillRoundedRect(-118, -163, 236, 96, 22)
      c.add(g)
      // fiori della stagione
      lv.flowers.slice(0, 3).forEach((id, k, arr) => {
        const fx = (k - (arr.length - 1) / 2) * 70
        const f = this.add.image(fx, -115, 'fl_' + id).setScale(.4)
        if (!unlocked) f.setTint(0x9a9a9a)
        c.add(f)
        this.tweens.add({ targets: f, angle: { from: -6, to: 6 }, duration: 1500 + k * 200, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
      })
      c.add(txt(this, 0, -28, `${lv.id}`, 30, '#d2893c', 700))
      c.add(txt(this, 0, 14, lv.season, 34, '#262c1f', 700))
      c.add(txt(this, 0, 54, lv.subtitle, 20, '#5f6b5a', 500, { wordWrap: { width: 210 } }))
      const st = store.stars(lv.id)
      for (let s = 0; s < 3; s++) c.add(this.add.image(-60 + s * 60, 116, s < st ? 'star' : 'starEmpty').setScale(.42))
      if (!unlocked) {
        const lock = this.add.graphics()
        lock.fillStyle(0x363d2d, .85).fillCircle(0, -115, 40)
        lock.lineStyle(7, 0xfaf7f1).strokeRoundedRect(-13, -142, 26, 32, 11)
        lock.fillStyle(0xfaf7f1).fillRoundedRect(-20, -122, 40, 30, 6)
        c.add(lock)
      }
      c.setSize(260, 340).setInteractive({ useHandCursor: unlocked })
      c.on('pointerdown', () => {
        audio.unlock()
        if (!unlocked) { audio.play('hit', .6); this.tweens.add({ targets: c, x: x + 10, duration: 50, yoyo: true, repeat: 3 }); return }
        audio.play('click'); audio.startMusic()
        this.tweens.add({ targets: c, scale: .92, duration: 80, yoyo: true })
        fadeTo(this, 'Intro', { level: lv.id })
      })
      if (unlocked) {
        c.on('pointerover', () => this.tweens.add({ targets: c, scale: 1.05, duration: 120 }))
        c.on('pointerout', () => this.tweens.add({ targets: c, scale: 1, duration: 120 }))
      }
      this.tweens.add({ targets: c, alpha: 1, y, duration: 450, delay: 120 * i, ease: 'Back.out' })
    })

    const total = LEVELS.reduce((s, l) => s + store.stars(l.id), 0)
    panel(this, W / 2, 650, 300, 70, 35)
    this.add.image(W / 2 - 90, 650, 'star').setScale(.4)
    txt(this, W / 2 + 20, 648, `${total} / ${LEVELS.length * 3}`, 34, '#262c1f', 700)
  }
}
