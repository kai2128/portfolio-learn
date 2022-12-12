import * as THREE from 'three'
import { Experience } from '../Experience'
import { Room } from './Room'
import { Environment } from './Environment'
import { Control } from './Control'

export class World {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.canvas = this.experience.canvas
    this.scene = this.experience.scene
    this.camera = this.experience.camera

    this.resources = this.experience.resources
    this.resources.on('ready', () => {
      this.room = new Room()
      this.environment = new Environment()
      this.control = new Control()
    })
  }

  resize() {
  }

  update() {
    if (this.room)
      this.room.update()

    if (this.control)
      this.control.update()
  }
}
