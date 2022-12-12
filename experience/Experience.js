import * as THREE from 'three'
import { Camera } from './Camera'
import { Renderer } from './Renderer'
import { Sizes } from './utils/Sizes'
import { Time } from './utils/Time'
import { World } from './world/world'

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
    this.world = new World()

    this.time.on("update", () => {
      this.update()
    })
    this.sizes.on("resize", () => {
      this.resize()
    })
  }
  resize() {
    this.camera?.resize()
    this.renderer?.resize()
  }
  update() {
    this.renderer?.update()
    this.camera?.update()
  }
}
