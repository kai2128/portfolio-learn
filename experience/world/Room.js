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
    this.roomChildren = {}

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
    this.swim = this.mixer.clipAction(this.room.animations[6])
    this.swim.play()
  }

  setLight() {
    const rectLight = new THREE.RectAreaLight(0xFFFFFF, 0, 0.3, 1.4)
    rectLight.position.set(9.2, 12.3, -2.0)
    rectLight.rotation.x = -Math.PI / 2
    rectLight.rotation.z = Math.PI / 4
    this.actualRoom.add(rectLight)
    this.fishTankLight = rectLight
    this.roomChildren.rectLight = rectLight

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

      if (child.name === 'Aquarium') {
        child.children[1].material = new THREE.MeshPhysicalMaterial()
        child.children[1].material.color.set(0x549AA2)
        child.children[1].material.roughness = 0
        child.children[1].material.ior = 3
        child.children[1].material.transmission = 1
        child.children[1].material.opacity = 1
      }

      if (child.name === 'Computer') {
        child.children[1].material = new THREE.MeshBasicMaterial({
          map: this.resources?.items.screen,
        })
      }

      if (child.name === 'Mini_Floor') {
        child.position.x = -0.669599
        child.position.z = 9.76722
      }

      // if (child.name === 'Mailbox' || child.name === 'Lamp' || child.name === 'FloorFirst' || child.name === 'FloorSecond' || child.name === 'FloorThird' || child.name === 'Dirt' || child.name === 'Flower')
      //   child.scale.set(0, 0, 0)
      child.scale.set(0, 0, 0)

      // setup initial preloader cube
      if (child.name === 'Cube143') {
        // child.scale.set(1, 1, 1)
        child.position.set(0, -0.05, 0)
        child.rotation.y = Math.PI / 4
      }
      this.roomChildren[child.name.toLowerCase()] = child
    })
    this.scene.add(this.actualRoom)
    this.actualRoom.scale.set(0.09, 0.09, 0.09)
  }

  resize() {
  }

  update() {
    this.actualRoom.rotation.y = this.lerp.current
    this.lerp.current = gsap.utils.interpolate(this.lerp.current, this.lerp.target, this.lerp.ease)
    this.mixer?.update(this.time.delta * 0.001)
  }
}
