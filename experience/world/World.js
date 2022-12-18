import EventEmitter from 'events'
import * as THREE from 'three'
import { Experience } from '../Experience'
import { Room } from './Room'
import { Environment } from './Environment'
import { Control } from './Control'
import { Floor } from './Floor'

export class World extends EventEmitter {
  constructor() {
    super()
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.canvas = this.experience.canvas
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.theme = this.experience.theme

    this.resources = this.experience.resources
    this.resources.on('ready', () => {
      this.floor = new Floor()
      this.room = new Room()
      this.environment = new Environment()
      this.emit('worldready')
    })

    this.theme.on('switch', (theme) => {
      this.switchTheme(theme)
    })
  }

  switchTheme(theme) {
    if (this.environment)
      this.environment.switchTheme(theme)
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
