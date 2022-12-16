import { EventEmitter } from 'events'

export class Sizes extends EventEmitter {
  constructor() {
    super()
    this.frustrum = 5
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.aspect = this.width / this.height
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.aspect = this.width / this.height
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)
      this.emit('resize')
    })
  }
}
