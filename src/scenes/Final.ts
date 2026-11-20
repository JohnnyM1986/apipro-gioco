import Phaser from 'phaser'
import { W, H, txt, button, fadeTo, flutterBee } from '../game/ui'
import { drawBackdrop } from '../game/backdrop'
import { LEVELS } from '../game/data'
import { store } from '../game/store'
import { audio } from '../game/audio'

/** Diploma finale da "Bottinatrice esperta", da mostrare (o fotografare) al Bee Park */
export class Final extends Phaser.Scene {
  constructor() { super('Final') }

  create() {
    this.cameras.main.fadeIn(500, 250, 247, 241)
    drawBackdrop(this, LEVELS[2])
    audio.play('win')
    const total = LEVELS.reduce((s, l) => s + store.stars(l.id), 0)

    this.add.particles(0, -20, 'petal', {
      x: { min: 0, max: W }, speedY: { min: 80, max: 200 }, speedX: { min: -50, max: 50 }, lifespan: 7000, rotate: { min: 0, max: 360 },
      scale: { min: .5, max: .9 }, tint: [0xf2b632, 0xd2893c, 0xffffff, 0xe0628a, 0xa99bd6, 0x8fc364], frequency: 90
    })

    // Diploma: cornice a doppio bordo in stile pergamena
    const g = this.add.graphics()
    g.fillStyle(0x262c1f, .3).fillRoundedRect(W / 2 - 474, 52, 960, 600, 26)
    g.fillStyle(0xfffaf0, 1).fillRoundedRect(W / 2 - 480, 40, 960, 600, 26)
    g.lineStyle(8, 0xd2893c).strokeRoundedRect(W / 2 - 460, 60, 920, 560, 18)
    g.lineStyle(3, 0x363d2d).strokeRoundedRect(W / 2 - 446, 74, 892, 532, 12)

    this.add.image(W / 2, 128, 'logo').setScale(.3)
    txt(this, W / 2, 210, 'DIPLOMA DI', 32, '#5e4a33', 600).setLetterSpacing(6)
    const t = txt(this, W / 2, 272, 'Bottinatrice esperta', 70, '#d2893c', 700).setStroke('#363d2d', 6).setScale(0)
    this.tweens.add({ targets: t, scale: 1, duration: 700, ease: 'Back.out' })
    txt(this, W / 2, 344, 'Hai aiutato le api a raccogliere il nettare\nin tutte le stagioni, dal tarassaco all’edera!', 27, '#262c1f', 500)

    for (let i = 0; i < LEVELS.length * 3; i++) {
      const s = this.add.image(W / 2 - 330 + i * 60, 430, i < total ? 'star' : 'starEmpty').setScale(0)
      this.tweens.add({ targets: s, scale: .38, duration: 300, delay: 600 + i * 90, ease: 'Back.out' })
    }
    txt(this, W / 2, 486, `${total} stelle su ${LEVELS.length * 3}`, 28, '#5e4a33', 600)

    // sigillo con l'ape del logo
    const seal = this.add.container(W / 2 + 350, 520)
    const sg = this.add.graphics()
    sg.fillStyle(0xd2893c, 1).fillCircle(0, 0, 58)
    sg.lineStyle(4, 0xffffff, .9).strokeCircle(0, 0, 48)
    seal.add([sg, this.add.image(0, 0, 'ape').setScale(.32).setTintFill(0xffffff)])
    this.tweens.add({ targets: seal, angle: { from: -8, to: 8 }, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.inOut' })

    this.add.image(W / 2 - 300, 566, 'loghi').setDisplaySize(240, 56)
    button(this, W / 2 + 40, 572, 'GIOCA ANCORA', () => fadeTo(this, 'Levels'), { scale: .62 })
    flutterBee(this, 150, 300, .9)
    void H
  }
}
