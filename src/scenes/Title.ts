import Phaser from 'phaser'
import { W, H, txt, button, iconButton, fadeTo, flutterBee, FONT } from '../game/ui'
import { drawBackdrop } from '../game/backdrop'
import { LEVELS } from '../game/data'
import { audio } from '../game/audio'

export class Title extends Phaser.Scene {
  bee!: Phaser.GameObjects.Container
  a = 0
  constructor() { super('Title') }

  update(_t: number, dt: number) {
    this.a += dt * .0011
    const a = this.a
    this.bee.setScale(Math.cos(a) >= 0 ? 1 : -1, 1)
    this.bee.setPosition(W / 2 + Math.sin(a) * 470, 300 + Math.sin(a * 2) * 90)
  }

  create() {
    this.cameras.main.fadeIn(500, 250, 247, 241)
    drawBackdrop(this, LEVELS[0], 610)

    // Fiori decorativi che ondeggiano in basso
    const deco = ['tarassaco', 'girasole', 'rododendro', 'colza', 'astro_marino', 'amorfa', 'tiglio', 'robinia']
    deco.forEach((id, i) => {
      const x = 70 + i * 162 + (i % 2) * 30, y = 600 - (i % 3) * 30
      const st = this.add.graphics().setDepth(30)
      st.lineStyle(7, 0x4f7a2e, 1).beginPath().moveTo(x, 650).lineTo(x, y).strokePath()
      const f = this.add.image(x, y, 'fl_' + id).setScale(0).setDepth(31)
      this.tweens.add({ targets: f, scale: .5, duration: 600, delay: 300 + i * 90, ease: 'Back.out' })
      this.tweens.add({ targets: f, angle: { from: -5, to: 5 }, duration: 1800 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
    })

    // Fascia bianca in alto con il logo ApiPRO
    const top = this.add.graphics().setDepth(50)
    top.fillStyle(0xffffff, .92).fillRoundedRect(W / 2 - 230, -30, 460, 175, 40)
    const logo = this.add.image(W / 2, 64, 'logo').setScale(.42).setDepth(51).setAlpha(0)
    this.tweens.add({ targets: logo, alpha: 1, y: 70, duration: 600, ease: 'Sine.out' })

    // Titolo
    const t1 = txt(this, W / 2, 218, 'Il volo della', 54, '#ffffff', 600).setDepth(52)
      .setStroke('#363d2d', 12).setShadow(0, 6, 'rgba(0,0,0,.25)', 6, true, true)
    const t2 = this.add.text(W / 2, 300, 'BOTTINATRICE', {
      fontFamily: FONT, fontSize: '104px', fontStyle: '700', color: '#f2b632'
    }).setOrigin(.5).setDepth(52).setStroke('#363d2d', 16).setShadow(0, 8, 'rgba(0,0,0,.3)', 8, true, true)
    const grad = t2.context.createLinearGradient(0, 20, 0, 110)
    grad.addColorStop(0, '#ffe07a'); grad.addColorStop(1, '#d2893c')
    t2.setFill(grad)
    ;[t1, t2].forEach((t, i) => {
      t.setScale(0)
      this.tweens.add({ targets: t, scale: 1, duration: 700, delay: 200 + i * 150, ease: 'Back.out' })
    })
    this.tweens.add({ targets: t2, angle: { from: -1.5, to: 1.5 }, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.inOut' })

    // Ape che vola a otto intorno al titolo, con scia di polline
    const bee = flutterBee(this, W / 2, 300, 1).setDepth(53)
    const trail = this.add.particles(0, 0, 'pollen', { lifespan: 700, scale: { start: .6, end: 0 }, alpha: { start: .9, end: 0 }, frequency: 40, follow: bee }).setDepth(52)
    this.bee = bee
    this.a = 0
    void trail

    // Pulsante gioca
    const play = button(this, W / 2, 470, 'GIOCA', () => { audio.startMusic(); fadeTo(this, 'Levels') }).setDepth(60)
    play.setScale(0)
    this.tweens.add({ targets: play, scale: 1, duration: 500, delay: 700, ease: 'Back.out', onComplete: () =>
      this.tweens.add({ targets: play, scale: 1.05, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' }) })

    // Audio
    iconButton(this, W - 60, 60, audio.muted ? 'icoMute' : 'icoSound', (ic) => { audio.unlock(); audio.toggle(); ic.setTexture(audio.muted ? 'icoMute' : 'icoSound') }).setDepth(60)

    // Loghi istituzionali (obbligatori nella comunicazione del progetto)
    const band = this.add.graphics().setDepth(70)
    band.fillStyle(0xffffff, 1).fillRect(0, H - 62, W, 62)
    this.add.image(W / 2, H - 31, 'loghi').setDisplaySize(240, 56).setDepth(71)
    txt(this, 20, H - 31, 'Progetto ApiPRO · PEI-AGRI · CSR Veneto 2023–2027', 18, '#5f6b5a', 500).setOrigin(0, .5).setDepth(71)
    txt(this, W - 20, H - 31, 'Gioco educativo · 6–10 anni', 18, '#5f6b5a', 500).setOrigin(1, .5).setDepth(71)
  }
}
