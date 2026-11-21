import Phaser from 'phaser'
import { W, H, txt, iconButton, panel, button, fadeTo } from '../game/ui'
import { drawBackdrop } from '../game/backdrop'
import { LEVELS, SPECIES, type Level } from '../game/data'
import { audio } from '../game/audio'
import { store } from '../game/store'

const GROUND = 640
const MAX_CARRY = 5
const HIVE = { x: 125, y: 540 }
// durata (s) delle fasi F0..F5 di un fiore nel gioco
const PHASE_T = [2.6, 2.2, 3.2, 9, 2.8, 1.6]

class Flower {
  stem: Phaser.GameObjects.Graphics
  bud: Phaser.GameObjects.Image
  head: Phaser.GameObjects.Image
  ring: Phaser.GameObjects.Graphics
  halo: Phaser.GameObjects.Image
  phase = 0
  t = 0
  nectar = 4
  sip = 0
  sway = Math.random() * 6
  constructor(public scene: Play, public slot: number, public x: number, public hy: number, public sp: string, startPhase: number) {
    this.stem = scene.add.graphics().setDepth(30)
    this.bud = scene.add.image(x, hy, 'bud').setScale(0).setDepth(31)
    this.head = scene.add.image(x, hy, 'fl_' + sp).setScale(0).setDepth(32)
    this.ring = scene.add.graphics().setDepth(33)
    this.halo = scene.add.image(x, hy, 'pollen').setDepth(31).setScale(0).setAlpha(0).setTint(0xfff1a8).setBlendMode(Phaser.BlendModes.ADD)
    this.drawStem(0)
    this.phase = startPhase
    this.t = Math.random() * PHASE_T[startPhase] * .8
    this.applyPhase(true)
  }
  get ready() { return (this.phase === 2 || this.phase === 3) && this.nectar > 0 }
  drawStem(grow: number) {
    const g = this.stem.clear()
    const top = GROUND - (GROUND - this.hy) * grow
    g.lineStyle(8, 0x4f7a2e, 1).beginPath().moveTo(this.x, GROUND + 6)
    const bend = Math.sin(this.sway) * 6
    for (let i = 1; i <= 10; i++) { const k = i / 10; g.lineTo(this.x + bend * k * k, GROUND + 6 - (GROUND + 6 - top) * k) }
    g.strokePath()
    if (grow > .4) {
      const ly = GROUND - (GROUND - this.hy) * .35
      g.fillStyle(0x6fa84a, 1)
      g.fillEllipse(this.x - 22, ly, 44, 16).fillEllipse(this.x + 22, ly - 26, 44, 16)
    }
  }
  applyPhase(instant = false) {
    const s = this.scene, d = instant ? 0 : 450
    const full = this.sp === 'amorfa' ? .62 : .6
    if (this.phase === 0) {
      s.tweens.add({ targets: this.bud, scale: .55, duration: d, ease: 'Back.out' })
      this.drawStem(1)
    } else if (this.phase === 1) {
      s.tweens.add({ targets: this.bud, scale: 0, duration: d })
      s.tweens.add({ targets: this.head, scale: full * .45, duration: d, ease: 'Back.out' })
      if (!instant) audio.play('bloom', 1 + Math.random() * .4)
    } else if (this.phase === 2) {
      this.bud.setScale(0)
      s.tweens.add({ targets: this.head, scale: full * .75, duration: d, ease: 'Back.out' })
    } else if (this.phase === 3) {
      this.bud.setScale(0)
      s.tweens.add({ targets: this.head, scale: full, duration: d, ease: 'Back.out' })
      s.tweens.add({ targets: this.halo, scale: 9, alpha: .55, duration: 500 })
    } else if (this.phase === 4) {
      s.tweens.add({ targets: this.halo, alpha: 0, scale: 0, duration: 400 })
      this.head.setTint(0xc8b48c)
      s.tweens.add({ targets: this.head, scale: full * .8, angle: 22, y: this.hy + 14, duration: 900 })
    } else if (this.phase === 5) {
      s.petalBurst(this.x, this.hy + 14, SPECIES[this.sp].color)
      s.tweens.add({ targets: this.head, scale: 0, duration: 500 })
    }
  }
  update(dt: number) {
    this.sway += dt * 1.6
    if (this.phase >= 1 && this.phase <= 4) {
      this.head.x = this.x + Math.sin(this.sway) * 5
      this.halo.x = this.head.x
      if (this.phase === 3) this.halo.setAlpha(this.nectar > 0 ? .4 + Math.sin(this.sway * 2) * .15 : 0)
      this.drawStem(1)
    }
    this.t += dt
    if (this.t >= PHASE_T[this.phase]) {
      this.t = 0
      if (this.phase < 5) { this.phase++; this.applyPhase() } else { this.destroy(); return false }
    }
    // anello di raccolta
    this.ring.clear()
    if (this.sip > 0 && this.ready) {
      this.ring.lineStyle(8, 0xffffff, .6).strokeCircle(this.head.x, this.head.y, 52)
      this.ring.lineStyle(8, 0xd2893c, 1).beginPath()
        .arc(this.head.x, this.head.y, 52, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * this.sip, false).strokePath()
    }
    // fiore vuoto: leggermente sbiadito
    if ((this.phase === 2 || this.phase === 3) && this.nectar <= 0) this.head.setAlpha(.6)
    return true
  }
  destroy() { this.stem.destroy(); this.bud.destroy(); this.head.destroy(); this.ring.destroy(); this.halo.destroy() }
}

export class Play extends Phaser.Scene {
  lv!: Level
  bee!: Phaser.GameObjects.Container
  beeBody!: Phaser.GameObjects.Image
  wings: Phaser.GameObjects.Image[] = []
  vel = new Phaser.Math.Vector2()
  target = new Phaser.Math.Vector2(400, 360)
  steering = false
  keys!: Record<string, Phaser.Input.Keyboard.Key>
  flowers: (Flower | null)[] = []
  slotX: number[] = []
  carry = 0
  delivered = 0
  timeLeft = 0
  invuln = 0
  dizzy = 0
  over = false
  paused = false
  hornets: { s: Phaser.GameObjects.Container; wp: Phaser.Math.Vector2; rest: number }[] = []
  smogs: { s: Phaser.GameObjects.Image; vx: number; base: number; ph: number }[] = []
  carryIcons: Phaser.GameObjects.Image[] = []
  jarFill!: Phaser.GameObjects.Graphics
  jarText!: Phaser.GameObjects.Text
  dayBar!: Phaser.GameObjects.Graphics
  daySun!: Phaser.GameObjects.Image
  hive!: Phaser.GameObjects.Image
  arrow!: Phaser.GameObjects.Container
  trail!: Phaser.GameObjects.Particles.ParticleEmitter
  tutorial = 0
  tutHand?: Phaser.GameObjects.Image
  tutText?: Phaser.GameObjects.Container
  dizzyStars?: Phaser.GameObjects.Container
  pauseLayer?: Phaser.GameObjects.Container
  lastTick = 0
  petals?: Phaser.GameObjects.Particles.ParticleEmitter
  sparks?: Phaser.GameObjects.Particles.ParticleEmitter
  guards: { b: Phaser.GameObjects.Image; a: number }[] = []

  constructor() { super('Play') }

  init(data: { level: number }) {
    this.lv = LEVELS[data.level - 1]
    Object.assign(this, { carry: 0, delivered: 0, timeLeft: this.lv.time, invuln: 0, dizzy: 0, over: false, paused: false,
      flowers: [], slotX: [], petals: undefined, sparks: undefined, hornets: [], smogs: [], carryIcons: [], wings: [], lastTick: 0, steering: false })
    this.vel = new Phaser.Math.Vector2()
    this.tutorial = this.lv.id === 1 && !store.get('tutorialDone', false) ? 1 : 0
  }

  create() {
    this.cameras.main.fadeIn(400, 250, 247, 241)
    drawBackdrop(this, this.lv, GROUND, true)

    // Arnia con il simbolo ApiPRO e api di guardia che le girano intorno
    this.add.ellipse(HIVE.x, GROUND + 4, 200, 26, 0x000000, .15).setDepth(19)
    this.hive = this.add.image(HIVE.x, GROUND + 6, 'hive').setOrigin(.5, 1).setScale(.78).setDepth(20)
    this.add.image(HIVE.x, GROUND - 155, 'ape').setScale(.2).setDepth(21)
    this.guards = [0, 1].map((i) => ({ b: this.add.image(HIVE.x, HIVE.y, 'bee').setScale(.12).setDepth(22), a: i * Math.PI }))

    // Posizioni dei fiori distribuite sul prato
    const n = this.lv.slots
    for (let i = 0; i < n; i++) this.slotX.push(330 + (i + .5) * (W - 380) / n)
    for (let i = 0; i < n; i++) this.spawnFlower(i, Phaser.Math.Between(1, 3))
    this.flowers[0]!.phase = 3; this.flowers[0]!.applyPhase(true)

    this.makeBee()

    for (let i = 0; i < this.lv.hornets; i++) this.time.delayedCall(6000 + i * 9000, () => this.spawnHornet())
    for (let i = 0; i < this.lv.smog; i++) this.time.delayedCall(4000 + i * 7000, () => this.spawnSmog())

    this.makeHud()

    // Comandi: dito o mouse; frecce o WASD
    this.input.on('pointerdown', (p: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => { audio.unlock(); if (over.length) return; this.steering = true; this.setTarget(p) })
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => { if (p.isDown || !p.wasTouch) { this.steering = true; this.setTarget(p) } })
    this.input.on('pointerup', (p: Phaser.Input.Pointer) => { if (p.wasTouch) this.steering = false })
    this.keys = this.input.keyboard!.addKeys('UP,DOWN,LEFT,RIGHT,W,A,S,D,P,ESC') as Record<string, Phaser.Input.Keyboard.Key>
    this.keys.P.on('down', () => this.togglePause())
    this.keys.ESC.on('down', () => this.togglePause())

    if (this.tutorial) this.showTutorial()
    this.game.events.on('hidden', this.autoPause, this)
    this.events.once('shutdown', () => this.game.events.off('hidden', this.autoPause, this))
  }

  autoPause() { if (!this.paused && !this.over) this.togglePause() }

  setTarget(p: Phaser.Input.Pointer) {
    // sul touch l'ape sta un po' sopra il dito, così il bambino la vede
    const off = p.wasTouch ? 70 : 0
    this.target.set(Phaser.Math.Clamp(p.x, 40, W - 40), Phaser.Math.Clamp(p.y - off, 120, GROUND - 30))
  }

  // ---------------------------------------------------------------- personaggi
  makeBee() {
    this.bee = this.add.container(420, 380).setDepth(70)
    const wb = this.add.image(-8, -36, 'wing').setOrigin(.3, 1).setScale(.5).setAlpha(.85)
    const wf = this.add.image(10, -34, 'wing').setOrigin(.3, 1).setScale(.55)
    this.beeBody = this.add.image(0, 0, 'bee').setScale(.5)
    this.bee.add([wb, this.beeBody, wf])
    this.wings = [wb, wf]
    this.tweens.add({ targets: this.wings, scaleY: .12, duration: 45, yoyo: true, repeat: -1 })
    this.target.set(this.bee.x, this.bee.y)
    this.trail = this.add.particles(0, 0, 'pollen', {
      lifespan: 600, scale: { start: .55, end: 0 }, alpha: { start: .9, end: 0 }, speed: 12, frequency: 35, follow: this.bee, followOffset: { x: -30, y: 10 }
    }).setDepth(69)
    this.trail.stop()
  }

  spawnFlower(slot: number, phase = 0) {
    const sp = Phaser.Utils.Array.GetRandom(this.lv.flowers)
    const x = this.slotX[slot] + Phaser.Math.Between(-30, 30)
    const hy = Phaser.Math.Between(300, 520)
    this.flowers[slot] = new Flower(this, slot, x, hy, sp, phase)
  }

  spawnHornet() {
    const c = this.add.container(W + 120, Phaser.Math.Between(200, 450)).setDepth(60)
    const w1 = this.add.image(-6, -38, 'wing').setOrigin(.3, 1).setScale(.5).setTint(0xd8d0c0)
    const body = this.add.image(0, 0, 'hornet').setScale(.5)
    c.add([w1, body])
    this.tweens.add({ targets: w1, scaleY: .1, duration: 35, yoyo: true, repeat: -1 })
    this.hornets.push({ s: c, wp: this.randomWaypoint(), rest: 0 })
    audio.play('whoosh', .6)
  }

  spawnSmog() {
    const fromLeft = Math.random() < .5
    const s = this.add.image(fromLeft ? 260 : W + 140, 0, 'smog').setDepth(55).setAlpha(.92).setScale(.85)
    const base = Phaser.Math.Between(220, 470)
    s.y = base
    this.tweens.add({ targets: s, scale: .95, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
    this.smogs.push({ s, vx: (fromLeft ? 1 : -1) * Phaser.Math.Between(45, 70), base, ph: Math.random() * 6 })
  }

  randomWaypoint() { return new Phaser.Math.Vector2(Phaser.Math.Between(320, W - 80), Phaser.Math.Between(170, 520)) }

  // ---------------------------------------------------------------- HUD
  makeHud() {
    const D = 100
    // Bottino dell'ape
    const g = this.add.graphics().setDepth(D)
    g.fillStyle(0x262c1f, .2).fillRoundedRect(24, 22, 360, 86, 43)
    g.fillStyle(0xfaf7f1, .95).fillRoundedRect(20, 16, 360, 86, 43)
    this.add.image(66, 58, 'bee').setScale(.26).setDepth(D)
    for (let i = 0; i < MAX_CARRY; i++) this.carryIcons.push(this.add.image(130 + i * 52, 58, 'dropEmpty').setScale(.75).setDepth(D))

    // Vasetto del miele (obiettivo)
    const jx = W / 2 + 20
    g.fillStyle(0x262c1f, .2).fillRoundedRect(jx - 136, 22, 260, 86, 43)
    g.fillStyle(0xfaf7f1, .95).fillRoundedRect(jx - 140, 16, 260, 86, 43)
    this.jarFill = this.add.graphics().setDepth(D)
    this.add.image(jx - 88, 58, 'jar').setScale(.44).setDepth(D + 1)
    this.jarText = txt(this, jx + 30, 58, `0 / ${this.lv.target}`, 38, '#262c1f', 700).setDepth(D)

    // Giornata: il sole attraversa la barra
    this.dayBar = this.add.graphics().setDepth(D)
    this.daySun = this.add.image(0, 136, 'sun').setScale(.22).setDepth(D + 1)

    // Pausa e audio
    iconButton(this, W - 150, 58, 'icoPause', () => this.togglePause()).setDepth(D)
    iconButton(this, W - 60, 58, audio.muted ? 'icoMute' : 'icoSound', (ic) => { audio.toggle(); ic.setTexture(audio.muted ? 'icoMute' : 'icoSound') }).setDepth(D)

    // Freccia "torna all'arnia"
    this.arrow = this.add.container(HIVE.x, HIVE.y - 200).setDepth(D).setVisible(false)
    const ag = this.add.graphics()
    ag.fillStyle(0xd2893c, 1).lineStyle(6, 0xffffff, 1)
    ag.beginPath().moveTo(-26, -40).lineTo(26, -40).lineTo(26, 0).lineTo(48, 0).lineTo(0, 46).lineTo(-48, 0).lineTo(-26, 0).closePath().fillPath().strokePath()
    const at = txt(this, 0, -76, 'Arnia!', 30, '#ffffff', 700).setStroke('#363d2d', 8)
    this.arrow.add([ag, at])
    this.tweens.add({ targets: this.arrow, y: HIVE.y - 186, duration: 400, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
    this.updateHud()
  }

  updateHud() {
    this.carryIcons.forEach((c, i) => c.setTexture(i < this.carry ? 'drop' : 'dropEmpty'))
    const jx = W / 2 + 20 - 88
    const k = Math.min(1, this.delivered / this.lv.target)
    this.jarFill.clear().fillStyle(0xf2b632, 1).fillRoundedRect(jx - 22, 82 - 46 * k, 44, 46 * k, 6)
    this.jarText.setText(`${Math.min(this.delivered, this.lv.target)} / ${this.lv.target}`)
    this.arrow.setVisible(this.carry >= MAX_CARRY || (this.tutorial === 3))
  }

  drawDay() {
    const x0 = W / 2 - 220, w = 480, k = 1 - this.timeLeft / this.lv.time
    const late = this.timeLeft <= 10
    this.dayBar.clear()
    this.dayBar.fillStyle(0x262c1f, .25).fillRoundedRect(x0, 128, w, 16, 8)
    this.dayBar.fillStyle(late ? 0xe07a3a : 0xf6c745, 1).fillRoundedRect(x0, 128, Math.max(16, w * k), 16, 8)
    this.daySun.x = x0 + w * k
    if (late) this.daySun.setTint(0xff9a6a)
  }

  // ---------------------------------------------------------------- effetti
  petalBurst(x: number, y: number, color: number) {
    if (!this.petals) this.petals = this.add.particles(0, 0, 'petal', {
      speed: { min: 60, max: 160 }, angle: { min: 200, max: 340 }, gravityY: 220, lifespan: 1400, rotate: { min: 0, max: 360 },
      scale: { start: .7, end: .3 }, alpha: { start: 1, end: 0 }, emitting: false
    }).setDepth(75)
    this.petals.particleTint = color === 0xfffef6 ? 0xf3f0e0 : color
    this.petals.explode(10, x, y)
  }

  sparkle(x: number, y: number, n = 12, tint = 0xfff1a8) {
    if (!this.sparks) this.sparks = this.add.particles(0, 0, 'spark', {
      speed: { min: 80, max: 240 }, lifespan: 600, scale: { start: .8, end: 0 }, rotate: { min: 0, max: 180 }, emitting: false
    }).setDepth(80)
    this.sparks.particleTint = tint
    this.sparks.explode(n, x, y)
  }

  floatText(x: number, y: number, s: string, color = '#d2893c', size = 40) {
    const t = txt(this, x, y, s, size, color, 700).setStroke('#ffffff', 8).setDepth(90)
    this.tweens.add({ targets: t, y: y - 70, alpha: { from: 1, to: 0 }, scale: { from: .6, to: 1.15 }, duration: 900, ease: 'Cubic.out', onComplete: () => t.destroy() })
  }

  // ---------------------------------------------------------------- tutorial (solo prima partita)
  showTutorial() {
    const f = this.flowers[0]!
    this.tutHand = this.add.image(f.x + 40, f.hy + 60, 'hand').setDepth(95).setScale(.9)
    this.tweens.add({ targets: this.tutHand, x: f.x + 20, y: f.hy + 30, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
    this.setTutText('Trascina l’ape su un fiore che brilla ✨')
  }

  setTutText(s: string) {
    this.tutText?.destroy()
    const c = this.add.container(W / 2 + 120, 210).setDepth(96)
    const t = txt(this, 0, 0, s, 30, '#262c1f', 600)
    const g = this.add.graphics()
    g.fillStyle(0xffffff, .96).fillRoundedRect(-t.width / 2 - 28, -34, t.width + 56, 68, 34)
    g.lineStyle(4, 0xd2893c).strokeRoundedRect(-t.width / 2 - 28, -34, t.width + 56, 68, 34)
    c.add([g, t]).setScale(0)
    this.tweens.add({ targets: c, scale: 1, duration: 350, ease: 'Back.out' })
    this.tutText = c
  }

  advanceTutorial(step: number) {
    if (!this.tutorial || step <= this.tutorial) return
    this.tutorial = step
    this.tutHand?.destroy(); this.tutHand = undefined
    if (step === 2) this.setTutText('Ottimo! Raccogli altre gocce dai fiori 🌼')
    if (step === 3) this.setTutText('Ora porta il nettare all’arnia! 🏠')
    if (step === 4) {
      this.setTutText('Fantastico! Così si fa il miele 🍯')
      store.set('tutorialDone', true)
      this.time.delayedCall(2600, () => { this.tutText?.destroy(); this.tutorial = 0; this.updateHud() })
    }
    this.updateHud()
  }

  // ---------------------------------------------------------------- pausa e fine
  togglePause() {
    if (this.over) return
    this.paused = !this.paused
    if (this.paused) {
      this.tweens.pauseAll(); this.time.paused = true
      const c = this.add.container(0, 0).setDepth(200)
      c.add(this.add.rectangle(W / 2, H / 2, W, H, 0x262c1f, .55).setInteractive())
      c.add(panel(this, W / 2, H / 2, 560, 420))
      c.add(txt(this, W / 2, H / 2 - 140, 'Pausa', 64, '#262c1f', 700))
      c.add(button(this, W / 2, H / 2 - 20, 'CONTINUA', () => this.togglePause(), { scale: .8 }))
      c.add(button(this, W / 2, H / 2 + 110, 'STAGIONI', () => fadeTo(this, 'Levels'), { green: true, scale: .8 }))
      this.pauseLayer = c
    } else {
      this.pauseLayer?.destroy(); this.pauseLayer = undefined
      this.tweens.resumeAll(); this.time.paused = false
    }
  }

  finish(win: boolean) {
    if (this.over) return
    this.over = true
    this.trail.stop()
    const t = this.lv.target, d = this.delivered
    let stars = 0
    if (win) stars = this.timeLeft >= 15 ? 3 : 2
    else if (d >= Math.ceil(t * .6)) stars = 1
    store.setStars(this.lv.id, stars)
    if (win) {
      audio.play('win')
      const e = this.add.particles(0, -20, 'petal', {
        x: { min: 0, max: W }, speedY: { min: 150, max: 300 }, speedX: { min: -60, max: 60 }, lifespan: 4000, rotate: { min: 0, max: 360 },
        scale: { min: .6, max: 1 }, tint: [0xf2b632, 0xd2893c, 0xffffff, 0xe0628a, 0xa99bd6, 0x8fc364], quantity: 3, frequency: 40
      }).setDepth(150)
      this.time.delayedCall(1500, () => e.stop())
      const big = txt(this, W / 2, H / 2, 'Evviva!', 120, '#ffffff', 700).setStroke('#d2893c', 18).setDepth(160).setScale(0)
      this.tweens.add({ targets: big, scale: 1, angle: { from: -10, to: 0 }, duration: 600, ease: 'Back.out' })
    } else {
      audio.play('dizzy')
      const big = txt(this, W / 2, H / 2, 'Il sole tramonta…', 90, '#ffffff', 700).setStroke('#363d2d', 16).setDepth(160).setScale(0)
      this.tweens.add({ targets: big, scale: 1, duration: 600, ease: 'Back.out' })
    }
    this.time.delayedCall(2200, () => fadeTo(this, 'LevelEnd', { level: this.lv.id, stars, delivered: Math.min(d, t), win }))
  }

  // ---------------------------------------------------------------- ciclo di gioco
  update(_time: number, deltaMs: number) {
    if (this.paused || this.over) return
    const dt = Math.min(deltaMs, 50) / 1000
    for (const g of this.guards) {
      g.a += dt * 3
      g.b.setPosition(HIVE.x + Math.cos(g.a) * 95, HIVE.y - 40 + Math.sin(g.a * 2) * 30).setFlipX(Math.sin(g.a) > 0)
    }

    // tempo
    if (!this.tutorial || this.tutorial >= 4) this.timeLeft -= dt
    if (this.timeLeft <= 10 && Math.ceil(this.timeLeft) !== this.lastTick) { this.lastTick = Math.ceil(this.timeLeft); if (this.lastTick > 0) audio.play('click', 1.6) }
    this.drawDay()
    if (this.timeLeft <= 0) { this.timeLeft = 0; this.finish(false); return }

    // movimento dell'ape
    const k = this.keys
    const kx = (k.RIGHT.isDown || k.D.isDown ? 1 : 0) - (k.LEFT.isDown || k.A.isDown ? 1 : 0)
    const ky = (k.DOWN.isDown || k.S.isDown ? 1 : 0) - (k.UP.isDown || k.W.isDown ? 1 : 0)
    const maxV = this.dizzy > 0 ? 200 : 540
    let desired: Phaser.Math.Vector2
    if (kx || ky) {
      this.steering = false
      desired = new Phaser.Math.Vector2(kx, ky).normalize().scale(maxV)
    } else if (this.steering) {
      desired = new Phaser.Math.Vector2(this.target.x - this.bee.x, this.target.y - this.bee.y)
      const dist = desired.length()
      desired.normalize().scale(Math.min(maxV, dist * 6))
    } else desired = new Phaser.Math.Vector2(0, 0)
    if (this.dizzy > 0) { desired.x += Math.sin(this.time.now * .02) * 160; desired.y += Math.cos(this.time.now * .017) * 120 }
    this.vel.lerp(desired, Math.min(1, dt * 7))
    this.bee.x = Phaser.Math.Clamp(this.bee.x + this.vel.x * dt, 40, W - 40)
    this.bee.y = Phaser.Math.Clamp(this.bee.y + this.vel.y * dt, 120, GROUND - 20)
    const speed = this.vel.length()
    // l'ape guarda dove va, si inclina e "galleggia" quando è ferma
    if (Math.abs(this.vel.x) > 30) this.bee.scaleX = this.vel.x < 0 ? -1 : 1
    if (this.dizzy <= 1.6) this.bee.rotation = Phaser.Math.Linear(this.bee.rotation, Phaser.Math.Clamp(this.vel.y / 1400, -.35, .35) * this.bee.scaleX, .2)
    this.beeBody.y = Math.sin(this.time.now * .006) * 4
    if (speed > 260) { if (!this.trail.emitting) this.trail.start() } else if (this.trail.emitting) this.trail.stop()
    if (this.invuln > 0) { this.invuln -= dt; this.bee.alpha = Math.sin(this.time.now * .04) > 0 ? 1 : .35; if (this.invuln <= 0) this.bee.alpha = 1 }
    if (this.dizzy > 0) { this.dizzy -= dt; if (this.dizzy <= 0) { this.dizzyStars?.destroy(); this.dizzyStars = undefined } }
    this.dizzyStars?.setPosition(this.bee.x, this.bee.y - 60)

    // fiori
    for (let i = 0; i < this.flowers.length; i++) {
      const f = this.flowers[i]
      if (!f) continue
      if (!f.update(dt)) { this.flowers[i] = null; this.time.delayedCall(Phaser.Math.Between(600, 2200), () => this.spawnFlower(i)); continue }
      const near = Phaser.Math.Distance.Between(this.bee.x, this.bee.y, f.head.x, f.head.y) < 62
      if (near && f.ready && this.carry < MAX_CARRY) {
        f.sip += dt / (f.phase === 3 ? .45 : .75)
        if (f.sip >= 1) this.collect(f)
      } else f.sip = Math.max(0, f.sip - dt * 2)
      if (near && f.ready && this.carry >= MAX_CARRY && Math.random() < dt * 1.5) this.floatText(this.bee.x, this.bee.y - 60, 'Pieno!', '#363d2d', 32)
      // scintille sui fiori pronti
      if (f.phase === 3 && f.nectar > 0 && Math.random() < dt * 1.2) this.sparkle(f.head.x + Phaser.Math.Between(-40, 40), f.head.y + Phaser.Math.Between(-40, 40), 2)
    }

    // consegna all'arnia
    if (this.carry > 0 && Phaser.Math.Distance.Between(this.bee.x, this.bee.y, HIVE.x, HIVE.y) < 115) this.deliver()

    // calabroni
    for (const h of this.hornets) {
      const s = h.s
      const toBee = Phaser.Math.Distance.Between(s.x, s.y, this.bee.x, this.bee.y)
      let tx = h.wp.x, ty = h.wp.y, sp = this.lv.hornetSpeed
      if (h.rest > 0) { h.rest -= dt; tx = W - 100; ty = 160; sp *= 1.6 }
      else if (toBee < 280 && this.invuln <= 0 && Phaser.Math.Distance.Between(this.bee.x, this.bee.y, HIVE.x, HIVE.y) > 170) { tx = this.bee.x; ty = this.bee.y; sp *= 1.25 }
      else if (Phaser.Math.Distance.Between(s.x, s.y, tx, ty) < 30) h.wp = this.randomWaypoint()
      const a = Math.atan2(ty - s.y, tx - s.x)
      s.x += Math.cos(a) * sp * dt
      s.y += Math.sin(a) * sp * dt + Math.sin(this.time.now * .008) * .8
      s.scaleX = Math.cos(a) < 0 ? -1 : 1
      if (toBee < 58 && this.invuln <= 0 && h.rest <= 0) this.hitByHornet(h)
    }

    // nuvole di pesticida
    for (const m of this.smogs) {
      m.ph += dt
      m.s.x += m.vx * dt
      m.s.y = m.base + Math.sin(m.ph * 1.3) * 40
      if (m.s.x < -160 || m.s.x > W + 160) {
        m.vx = -m.vx; m.base = Phaser.Math.Between(220, 470)
        m.s.x = m.vx > 0 ? -150 : W + 150
      }
      if (this.dizzy <= 0 && Phaser.Math.Distance.Between(m.s.x, m.s.y, this.bee.x, this.bee.y) < 80) this.getDizzy()
    }
  }

  collect(f: Flower) {
    f.sip = 0
    f.nectar--
    this.carry++
    audio.play('sip', 1 + this.carry * .12)
    this.tweens.add({ targets: f.head, scaleX: f.head.scaleX * 1.15, scaleY: f.head.scaleY * .85, duration: 90, yoyo: true })
    this.sparkle(f.head.x, f.head.y, 8)
    // la goccia vola verso il bottino nel riquadro in alto
    const slot = this.carryIcons[this.carry - 1]
    const d = this.add.image(f.head.x, f.head.y, 'drop').setScale(.6).setDepth(98)
    this.tweens.add({ targets: d, x: slot.x, y: slot.y, scale: .75, duration: 500, ease: 'Cubic.in', onComplete: () => {
      d.destroy(); this.updateHud()
      this.tweens.add({ targets: slot, scale: 1, duration: 100, yoyo: true })
    } })
    this.floatText(f.head.x, f.head.y - 50, '+1')
    if (this.carry === 1) this.advanceTutorial(2)
    if (this.carry >= 3) this.advanceTutorial(3)
    if (this.carry >= MAX_CARRY) { this.floatText(this.bee.x, this.bee.y - 80, 'Pieno! Torna all’arnia', '#363d2d', 30); this.updateHud() }
  }

  deliver() {
    const n = this.carry
    this.carry = 0
    this.updateHud()
    for (let i = 0; i < n; i++) {
      const d = this.add.image(this.bee.x, this.bee.y, 'drop').setScale(.6).setDepth(98)
      this.tweens.add({ targets: d, x: HIVE.x, y: GROUND - 40, scale: .3, delay: i * 110, duration: 380, ease: 'Cubic.in', onComplete: () => {
        d.destroy()
        this.delivered++
        audio.play('deliver', 1 + i * .1)
        this.updateHud()
        this.tweens.add({ targets: this.hive, scaleX: .84, scaleY: .72, duration: 80, yoyo: true })
        this.sparkle(HIVE.x, GROUND - 40, 6, 0xf2b632)
        if (i === n - 1) {
          this.floatText(HIVE.x + 10, GROUND - 230, `+${n} miele!`, '#d2893c', 44)
          this.advanceTutorial(4)
          if (this.delivered >= this.lv.target) this.finish(true)
        }
      } })
    }
  }

  hitByHornet(h: { rest: number }) {
    h.rest = 3.5
    this.invuln = 2
    this.cameras.main.shake(250, .008)
    audio.play('hit')
    if (this.carry > 0) {
      // le gocce cadono a terra
      for (let i = 0; i < this.carry; i++) {
        const d = this.add.image(this.bee.x, this.bee.y, 'drop').setScale(.55).setDepth(80)
        this.tweens.add({ targets: d, x: this.bee.x + Phaser.Math.Between(-90, 90), y: GROUND, angle: 180, alpha: 0, duration: 800, ease: 'Quad.in', onComplete: () => d.destroy() })
      }
      this.floatText(this.bee.x, this.bee.y - 60, 'Oh no! Il calabrone!', '#b5462f', 32)
      this.carry = 0
      this.updateHud()
    } else this.floatText(this.bee.x, this.bee.y - 60, 'Scappa!', '#b5462f', 32)
    this.vel.set(-this.vel.x - 300 * this.bee.scaleX, -200)
  }

  getDizzy() {
    this.dizzy = 2.4
    audio.play('dizzy')
    this.tweens.add({ targets: this.bee, angle: 360 * this.bee.scaleX, duration: 700, onComplete: () => { this.bee.angle = 0 } })
    this.floatText(this.bee.x, this.bee.y - 60, 'Che giramento!', '#5f6b3a', 30)
    this.dizzyStars?.destroy()
    const c = this.add.container(this.bee.x, this.bee.y - 60).setDepth(90)
    for (let i = 0; i < 3; i++) {
      const s = this.add.image(Math.cos(i * 2.1) * 34, Math.sin(i * 2.1) * 10, 'star').setScale(.18)
      c.add(s)
    }
    this.tweens.add({ targets: c, angle: 360, duration: 900, repeat: -1 })
    this.dizzyStars = c
  }
}
