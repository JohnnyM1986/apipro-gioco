import Phaser from 'phaser'
import '@fontsource/fredoka/latin-500.css'
import '@fontsource/fredoka/latin-600.css'
import '@fontsource/fredoka/latin-700.css'
import './style.css'
import { W, H } from './game/ui'
import { Boot } from './scenes/Boot'
import { Title } from './scenes/Title'
import { Levels } from './scenes/Levels'
import { Intro } from './scenes/Intro'
import { Play } from './scenes/Play'
import { LevelEnd } from './scenes/LevelEnd'
import { Final } from './scenes/Final'

// Il font va caricato prima di avviare il gioco, altrimenti Phaser disegna i testi con quello di sistema
const fonts = ['500', '600', '700'].map((w) => document.fonts.load(`${w} 40px "Fredoka"`))

Promise.race([Promise.all(fonts), new Promise((r) => setTimeout(r, 2500))]).finally(() => {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: W,
    height: H,
    backgroundColor: '#faf7f1',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { activePointers: 2 },
    render: { antialias: true, roundPixels: false },
    scene: [Boot, Title, Levels, Intro, Play, LevelEnd, Final]
  })
  ;(window as unknown as { __game: Phaser.Game }).__game = game
})
