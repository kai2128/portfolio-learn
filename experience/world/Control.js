import * as THREE from 'three'
import GSAP from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Experience } from '../Experience'

export class Control {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.camera = this.experience.camera
    this.room = this.experience.world.room.actualRoom
    this.sizes = this.experience.sizes

    GSAP.registerPlugin(ScrollTrigger)
    this.setPath()
  }

  setPath() {
    this.timeline = GSAP.timeline()
    this.timeline.to(this.room.position, { x: () => this.sizes.width * 0.0017, scrollTrigger: { trigger: '.first-move', markers: true, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true } })
  }

  resize() {
  }

  update() {
  }
}
