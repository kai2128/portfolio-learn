import * as THREE from 'three'
import GSAP from 'gsap'
import { Experience } from '../Experience'

export class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.fishTankLight = this.experience.world?.room.fishTankLight

    this.setSunlight()
  }

  switchTheme(theme) {
    if (theme === 'dark') {
      this.sunlightTween = GSAP.to(this.sunlight?.color, {
        r: 0.15,
        g: 0.2,
        b: 0.6,
      })
      this.ambientLightTween = GSAP.to(this.ambientLight?.color, {
        r: 0.15,
        g: 0.2,
        b: 0.5,
      })
      this.sunlightIntensityTween = GSAP.to(this.sunlight, {
        intensity: 0.78,
      })
      this.ambientLightIntensityTween = GSAP.to(this.ambientLight, {
        intensity: 0.78,
      })

      if (this.experience.preloader?.loadedIntro)
        this.openfishTankLight()
    }
    else {
      this.sunlightTween?.reverse()
      this.ambientLightTween?.reverse()
      this.sunlightIntensityTween?.reverse()
      this.ambientLightIntensityTween?.reverse()
      this.fishTankLightIntensityTween?.reverse()
    }
  }

  openfishTankLight() {
    this.fishTankLightIntensityTween = GSAP.to(this.fishTankLight, {
      intensity: 3,
    }).delay(0.5)
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
