import * as THREE from 'three'
import { Experience } from '../Experience'

export class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene

    this.setSunlight()
  }

  setSunlight() {
    this.sunlight = new THREE.DirectionalLight(0xFFFFFF, 3)
    this.sunlight.castShadow = true
    this.sunlight.shadow.camera.far = 20
    this.sunlight.shadow.mapSize.set(2048, 2048)
    this.sunlight.shadow.normalBias = 0.05
    // const helper = new THREE.CameraHelper(this.sunlight.shadow.camera)
    // this.scene.add(helper)
    
    this.sunlight.position.set(-1.5, 7, 3)
    this.scene.add(this.sunlight)

    this.ambientLight = new THREE.AmbientLight(0xFFE3FB, 1.25)
    this.scene.add(this.ambientLight)
  }

  resize() {
  }

  update() {
  }
}
