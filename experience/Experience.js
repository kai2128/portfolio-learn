import * as THREE from 'three'
import { Camera } from './Camera'
import { Preloader } from './Preloader'
import { Renderer } from './Renderer'
import { Theme } from './Theme'
import assets from './utils/assets'
import { Resources } from './utils/Resources'
import { Sizes } from './utils/Sizes'
import { Time } from './utils/Time'
import { World } from './world/world'
import { Control } from './world/Control'

export class Experience {
  static instance

  constructor(canvas) {
    if (Experience.instance) {
      return Experience.instance
    }
    Experience.instance = this
    this.canvas = canvas
    this.sizes = new Sizes()
    this.scene = new THREE.Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.time = new Time()
    this.resources = new Resources(assets)
    this.theme = new Theme()
    this.world = new World()
    this.preloader = new Preloader()

    this.preloader.on('enablecontrols', () => {
      this.control = new Control()
    })

    this.time.on("update", () => {
      this.update()
    })
    this.sizes.on("resize", () => {
      this.resize()
    })
  }
  resize() {
    this.camera?.resize()
    this.world?.resize()
    this.renderer?.resize()
  }
  update() {
    this.preloader?.update()
    this.renderer?.update() 
    this.world?.update()
    this.camera?.update()
  }
}
