import gsap from 'gsap'
import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { Experience } from '../Experience'

export class Room {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.room = this.resources.items.room
    this.time = this.experience.time
    this.actualRoom = this.room.scene

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    }

    this.setModel()
    this.setAnimation()
    this.setLight()
    this.onMouseMove()
  }

  onMouseMove() {
    window.addEventListener('mousemove', (event) => {
      this.rotation = ((event.clientX - window.innerWidth / 2) * 2) / window.innerWidth
      this.lerp.target = this.rotation * 0.1
    })
  }

  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom)
    this.swim = this.mixer.clipAction(this.room.animations[111])
    this.swim.play()
  }

  setLight() {
    const rectLight = new THREE.RectAreaLight(0xFFFFFF, 0, 0.7, 1.6)
    rectLight.position.set(9.2, 12.3, -2.0)
    rectLight.rotation.x = -Math.PI / 2
    rectLight.rotation.z = Math.PI / 4
    this.actualRoom.add(rectLight)
    this.fishTankLight = rectLight

    // rectLight.add(new RectAreaLightHelper(rectLight))
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

      if (child.name === 'Screen') {
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
    this.actualRoom.rotation.y = this.lerp.current
    this.lerp.current = gsap.utils.interpolate(this.lerp.current, this.lerp.target, this.lerp.ease)
    this.mixer?.update(this.time.delta * 0.001)
  }
}
