import Phaser from 'phaser'
import { audio } from './audio'

export const W = 1280
export const H = 720
export const FONT = '"Fredoka", "Trebuchet MS", sans-serif'
export const COL = { green: '#363d2d', greenD: '#262c1f', honey: '#d2893c', cream: '#faf7f1', brown: '#5e4a33' }

export function txt(scene: Phaser.Scene, x: number, y: number, s: string, size = 36, color = COL.greenD, weight = 600, extra: Phaser.Types.GameObjects.Text.TextStyle = {}) {
  return scene.add.text(x, y, s, { fontFamily: FONT, fontSize: `${size}px`, color, fontStyle: String(weight), align: 'center', ...extra }).setOrigin(.5)
}

/** Pulsante grande a pillola, con rimbalzo al tocco */
export function button(scene: Phaser.Scene, x: number, y: number, label: string, onClick: () => void, opts: { green?: boolean; scale?: number } = {}) {
  const s = opts.scale ?? 1
  const c = scene.add.container(x, y)
  const bg = scene.add.image(0, 0, opts.green ? 'btnGreen' : 'btn')
  const t = txt(scene, 0, -6, label, 44, '#ffffff', 700).setShadow(0, 3, 'rgba(0,0,0,.25)', 2)
  c.add([bg, t]).setSize(bg.width, bg.height).setScale(s)
  c.setInteractive({ useHandCursor: true })
  c.on('pointerover', () => scene.tweens.add({ targets: c, scale: s * 1.06, duration: 120 }))
  c.on('pointerout', () => scene.tweens.add({ targets: c, scale: s, duration: 120 }))
  c.on('pointerdown', () => {
    // l'azione parte subito e una sola volta (anche se il bambino tocca due volte o i tween sono in pausa)
    if (c.getData('lock')) return
    c.setData('lock', true)
    setTimeout(() => c.setData('lock', false), 450)
    audio.unlock(); audio.play('click')
    scene.tweens.add({ targets: c, scaleX: s * .92, scaleY: s * .88, duration: 70, yoyo: true })
    onClick()
  })
  return c
}

/** Pulsante tondo con icona (pausa, audio, casa) */
export function iconButton(scene: Phaser.Scene, x: number, y: number, icon: string, onClick: (img: Phaser.GameObjects.Image) => void) {
  const c = scene.add.container(x, y)
  const bg = scene.add.image(0, 0, 'round').setScale(.8)
  const ic = scene.add.image(0, -3, icon).setScale(.9)
  c.add([bg, ic]).setSize(80, 80).setInteractive({ useHandCursor: true })
  c.on('pointerdown', () => {
    if (c.getData('lock')) return
    c.setData('lock', true)
    setTimeout(() => c.setData('lock', false), 350)
    audio.unlock(); audio.play('click')
    scene.tweens.add({ targets: c, scale: .85, duration: 70, yoyo: true })
    onClick(ic)
  })
  return c
}

/** Pannello crema arrotondato con ombra */
export function panel(scene: Phaser.Scene, x: number, y: number, w: number, h: number, r = 36) {
  const g = scene.add.graphics()
  g.fillStyle(0x262c1f, .25).fillRoundedRect(x - w / 2 + 6, y - h / 2 + 12, w, h, r)
  g.fillStyle(0xfaf7f1, 1).fillRoundedRect(x - w / 2, y - h / 2, w, h, r)
  g.lineStyle(6, 0xd2893c, 1).strokeRoundedRect(x - w / 2, y - h / 2, w, h, r)
  return g
}

export function fadeTo(scene: Phaser.Scene, key: string, data?: object) {
  // un solo cambio di schermata alla volta
  if (scene.data.get('leaving')) return
  scene.data.set('leaving', true)
  scene.events.once('shutdown', () => scene.data.set('leaving', false))
  scene.tweens.resumeAll(); scene.time.paused = false
  scene.cameras.main.fadeOut(350, 250, 247, 241)
  scene.cameras.main.once('camerafadeoutcomplete', () => scene.scene.start(key, data))
}

/** Ape decorativa che svolazza (titolo, schede) */
export function flutterBee(scene: Phaser.Scene, x: number, y: number, scale = .6) {
  const c = scene.add.container(x, y)
  const wb = scene.add.image(-6, -42, 'wing').setOrigin(.5, 1).setScale(.55).setAlpha(.9)
  const wf = scene.add.image(14, -40, 'wing').setOrigin(.5, 1).setScale(.6)
  const body = scene.add.image(0, 0, 'bee').setScale(.55)
  c.add([wb, body, wf]).setScale(scale)
  scene.tweens.add({ targets: [wb, wf], scaleY: .15, duration: 60, yoyo: true, repeat: -1 })
  scene.tweens.add({ targets: c, y: y - 14, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
  return c
}
