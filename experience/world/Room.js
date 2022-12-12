import * as THREE from 'three'
import { Experience } from '../Experience'

export class Room {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.room = this.resources.items.room
    this.time = this.experience.time
    this.actualRoom = this.room.scene
    this.setModel()
    this.setAnimation()
  }

  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom)
    this.swim = this.mixer.clipAction(this.room.animations[111])
    this.swim.play()
  }

  setModel() {
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true
      child.receiveShadow = true

      if (child instanceof THREE.Group) {
        child.children.forEach((child) => {
          child.castShadow = true
          child.receiveShadow = true
        })
      }

      if (child.name === 'Fish_Glass') {
        child.material = new THREE.MeshPhysicalMaterial()
        child.material.color.set(0x549AA2)
        child.material.roughness = 0
        child.material.ior = 3
        child.material.transmission = 1
        child.material.opacity = 1
      }

      if(child.name === "Screen"){
        child.flipY = true
        child.material = new THREE.MeshBasicMaterial({
          map: this.resources?.items.screen,
        })
      }
    })
    this.scene.add(this.actualRoom)
    this.actualRoom.scale.set(0.11, 0.11, 0.11)
  }

  resize() {
  }

  update() {
    this.mixer?.update(this.time.delta * 0.001)
  }
}
