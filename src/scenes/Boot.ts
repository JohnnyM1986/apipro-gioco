import Phaser from 'phaser'
import { W, H, txt } from '../game/ui'
import { SPECIES } from '../game/data'

const ART = ['bee', 'wing', 'hornet', 'hive', 'cloud', 'smog', 'drop', 'dropEmpty', 'star', 'starEmpty', 'jar', 'sun', 'spark',
  'pollen', 'petal', 'tuft', 'bud', 'btn', 'btnGreen', 'round', 'icoPause', 'icoSound', 'icoMute', 'icoHome', 'hand']

export class Boot extends Phaser.Scene {
  constructor() { super('Boot') }

  preload() {
    // Barra di caricamento a forma di favo che si riempie di miele
    this.add.rectangle(W / 2, H / 2, W, H, 0xfaf7f1)
    txt(this, W / 2, H / 2 - 80, 'Le api si stanno svegliando…', 34, '#363d2d', 600)
    const bar = this.add.graphics()
    this.load.on('progress', (p: number) => {
      bar.clear()
      bar.fillStyle(0xe4dccd, 1).fillRoundedRect(W / 2 - 260, H / 2 - 16, 520, 32, 16)
      bar.fillStyle(0xd2893c, 1).fillRoundedRect(W / 2 - 260, H / 2 - 16, Math.max(32, 520 * p), 32, 16)
    })

    for (const k of ART) this.load.svg(k, `assets/art/${k}.svg`)
    for (const id of Object.keys(SPECIES)) this.load.svg('fl_' + id, `assets/art/fl_${id}.svg`)
    this.load.image('logo', 'assets/brand/apipro-logo.png')
    this.load.image('ape', 'assets/brand/apipro-ape.png')
    this.load.image('loghi', 'assets/brand/loghi-istituzionali.jpg')
  }

  create() { this.scene.start('Title') }
}
