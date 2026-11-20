import Phaser from 'phaser'
import { W, H } from './ui'
import type { Level } from './data'

const hex = (n: number) => '#' + n.toString(16).padStart(6, '0')

/** Disegna lo sfondo della stagione con parallasse leggera e animazioni d'ambiente */
export function drawBackdrop(scene: Phaser.Scene, lv: Pick<Level, 'sky' | 'hills' | 'ground' | 'water' | 'leaves'>, groundY = 640, front = false) {
  // Cielo sfumato
  const key = 'sky-' + lv.sky.join('-')
  if (!scene.textures.exists(key)) {
    const t = scene.textures.createCanvas(key, 4, H)!
    const ctx = t.getContext()
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, hex(lv.sky[0])); g.addColorStop(.75, hex(lv.sky[1]))
    ctx.fillStyle = g; ctx.fillRect(0, 0, 4, H); t.refresh()
  }
  scene.add.image(0, 0, key).setOrigin(0).setDisplaySize(W, H)

  // Sole con raggi che ruotano
  const sun = scene.add.image(1110, 110, 'sun').setScale(.9)
  scene.tweens.add({ targets: sun, angle: 360, duration: 60000, repeat: -1 })
  scene.tweens.add({ targets: sun, scale: .96, duration: 2500, yoyo: true, repeat: -1, ease: 'Sine.inOut' })

  // Nuvole che scorrono
  for (let i = 0; i < 4; i++) {
    const c = scene.add.image(Phaser.Math.Between(0, W), Phaser.Math.Between(50, 220), 'cloud')
      .setScale(Phaser.Math.FloatBetween(.4, .8)).setAlpha(Phaser.Math.FloatBetween(.7, .95))
    const speed = Phaser.Math.Between(40000, 80000)
    scene.tweens.add({ targets: c, x: W + 200, duration: speed * (1 - c.x / (W + 200)), onComplete: () => {
      c.x = -200; scene.tweens.add({ targets: c, x: W + 200, duration: speed, repeat: -1 })
    } })
  }

  // Colline a strati
  const hills = scene.add.graphics()
  const layer = (col: number, base: number, amp: number, freq: number, ph: number) => {
    hills.fillStyle(col, 1).beginPath().moveTo(0, H)
    for (let x = 0; x <= W; x += 16) hills.lineTo(x, base - amp * Math.sin(x * freq + ph) - amp * .5 * Math.sin(x * freq * 2.3 + ph * 2))
    hills.lineTo(W, H).closePath().fillPath()
  }
  layer(lv.hills[0], 430, 46, .006, 1)
  layer(lv.hills[1], 500, 34, .009, 3)
  if (lv.water) {
    // laguna con barene
    hills.fillStyle(0x8fcbe0, 1).fillRect(0, 540, W, 60)
    hills.fillStyle(0xbfe3ef, .8)
    for (let i = 0; i < 9; i++) hills.fillRoundedRect(60 + i * 140, 556 + (i % 2) * 14, 70, 4, 2)
  }
  layer(lv.hills[2], 575, 20, .012, 5)
  hills.fillStyle(lv.ground, 1).fillRect(0, groundY, W, H - groundY)
  hills.fillStyle(0x000000, .08).fillRect(0, groundY, W, 6)

  // Ciuffi d'erba che ondeggiano
  for (let x = -20; x < W + 40; x += Phaser.Math.Between(60, 110)) {
    const t = scene.add.image(x, groundY + 8, 'tuft').setOrigin(.5, 1).setScale(Phaser.Math.FloatBetween(.5, .9)).setDepth(front ? 40 : 0)
    scene.tweens.add({ targets: t, angle: { from: -3, to: 3 }, duration: Phaser.Math.Between(1400, 2200), yoyo: true, repeat: -1, ease: 'Sine.inOut', delay: Phaser.Math.Between(0, 1000) })
  }

  // Polline che fluttua nell'aria
  scene.add.particles(0, 0, 'pollen', {
    x: { min: 0, max: W }, y: { min: 120, max: 600 }, lifespan: 5000, speedX: { min: -10, max: 10 }, speedY: { min: -12, max: 4 },
    scale: { start: .45, end: 0 }, alpha: { start: .8, end: 0 }, frequency: 450
  }).setDepth(front ? 5 : 0)

  // Foglie che cadono (autunno)
  if (lv.leaves) {
    scene.add.particles(0, -20, 'petal', {
      x: { min: 0, max: W }, lifespan: 9000, speedY: { min: 40, max: 80 }, speedX: { min: -30, max: 30 },
      rotate: { min: 0, max: 360 }, scale: { min: .5, max: .9 }, tint: [0xd2893c, 0xb5462f, 0xe0a83a], frequency: 700
    }).setDepth(front ? 45 : 0)
  }
}
